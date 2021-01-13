const Joi = require('joi');
const logger = require('../logger');
const execute = require('../execute');
const hasValidationErrors = require('../validate');
const { createSite } = require('../lib/netlify');

const UPDATE_ACCOUNT = `
mutation UpdateAccount($account_id: uuid!, $_set: accounts_set_input!) {
  update_accounts_by_pk(pk_columns: {id: $account_id}, _set: $_set) {
    id
    username
  }
}
`;

const schema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow('', null),
  username: Joi.string().alphanum().required().messages({
    'string.alphanum': `Only letters and numbers allowed`
  }),
  fee_percent: Joi.number(),
  twitter: Joi.string().allow('', null),
  facebook: Joi.string().allow('', null),
  instagram: Joi.string().allow('', null),
  user_id: Joi.string(),
  logo: Joi.string().uri(),
  photo: Joi.string().uri(),
  whitelabel: Joi.boolean()
});

module.exports = async function UpdateAccount(req, res) {
  const { id, object } = req.body.input;

  let validationErrors;
  if ((validationErrors = hasValidationErrors(res, schema, object))) {
    return validationErrors;
  }

  // TODO is user allowed to update this record?

  if (object.whitelabel) {
    logger.info('Creating white label site on Netlify', object.username);
    let res = await createSite({ username: object.username });
    logger.info('Netlify Response', res);
  } else {
    // if exists, then remove
  }

  const { data, errors } = await execute(
    UPDATE_ACCOUNT,
    { account_id: id, _set: object },
    { ...req.headers, 'x-hasura-role': 'admin' }
  );

  if (errors) {
    return res.status(400).json(errors[0]);
  }

  return res.json({
    ...data.update_accounts_by_pk
  });
};
