const { v4: uuidv4 } = require('uuid');
const fetch = require("node-fetch");
const Joi = require("joi");
const execute = require("../execute");
const hasValidationErrors = require("../validate");
const mattermost = require('../lib/mattermost');

const CREATE_ACCOUNT = `
  mutation CreateAccount($objects: [accounts_insert_input!]!) {
  insert_accounts(objects: $objects) {
    returning {
      id
      username
    }
  }
}
`;

const schema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow('', null),
  username: Joi.string().alphanum().required().messages({
    'string.alphanum': `Only letters and numbers allowed`
  }),
  twitter: Joi.string().allow('', null),
  facebook: Joi.string().allow('', null),
  instagram: Joi.string().allow('', null),
  user_id: Joi.string(),
  logo: Joi.string().uri(),
  photo: Joi.string().uri(),
  store_url: Joi.string().uri().allow('', null)
});

module.exports = async function CreateAccount(req, res) {
  const { object } = req.body.input;

  let username = uuidv4();

  let validationErrors;
  if ((validationErrors = hasValidationErrors(res, schema, object))) {
    return validationErrors;
  }

  try {
    var { token: adminToken } = await fetch(
      `${process.env.UMAMI_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: process.env.UMAMI_USER,
          password: process.env.UMAMI_PASS
        })
      }
    ).then((res) => {
      return res.json();
    });
  } catch (e) {
    console.error("Failed to authenticate admin with Umami");
    console.error(e);
    throw e;
  }

  try {
    var account = await fetch(`${process.env.UMAMI_URL}/api/account`, {
      method: 'POST',
      headers: {
        Cookie: `umami.auth=${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password: process.env.UMAMI_PASS
      })
    }).then((res) => res.json());
  } catch (e) {
    console.error("Failed to create umami account");
    console.log(e);
    throw e;
  }

  try {
    var { token } = await fetch(`${process.env.UMAMI_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password: process.env.UMAMI_PASS
      })
    }).then((res) => res.json());
  } catch (e) {
    console.error("Failed to authenticate with Umami");
    console.error(e);
    throw e;
  }

  try {
    var website = await fetch(`${process.env.UMAMI_URL}/api/website`, {
      method: "POST",
      headers: {
        Cookie: `umami.auth=${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: object.username,
        domain: `vizee.live/${object.username}`,
        public: false,
        enable_share_url: false,
      }),
    }).then((res) => res.json());
  } catch (e) {
    console.error("Failed to create umami website");
    console.log(e);
    throw e;
  }

  try {
    var channel = await mattermost.createChannel({
      name: object.username.toLowerCase()
    });
    console.log({ channel });
  } catch (e) {
    console.log('Failed to create Mattermost channel', {
      name: object.username,
      msg: e.message
    });
    throw e;
  }

  object.created_by = object.user_id;
  object.mattermost_channel_id = channel.id;
  object.umami_id = account.user_id;
  object.umami_username = username;
  object.umami_website = website.website_uuid;
  object.users = { data: { user_id: object.user_id } };
  delete object.user_id;

  const { data, errors } = await execute(
    CREATE_ACCOUNT,
    { objects: object },
    { ...req.headers, "x-hasura-role": "admin" }
  );

  if (errors) {
    return res.status(400).json(errors[0]);
  }

  return res.json({
    ...data.insert_accounts.returning[0],
  });
};
