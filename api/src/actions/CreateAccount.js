const Joi = require('joi');
const execute = require('../execute');
const hasValidationErrors = require('../validate');

const gql = `
mutation MyMutation($object: accounts_insert_input!) {
  insert_accounts_one(object: $object) {
    id
    username
  }
}
`;

const schema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  username: Joi.string().alphanum().required().messages({
    'string.alphanum': `Only letters and numbers allowed`
  }),
  twitter: Joi.string(),
  facebook: Joi.string(),
  instagram: Joi.string(),
  photo: Joi.string().uri()
});

module.exports = async function CreateAccount(req, res) {
  const { object } = req.body.input;

  let validationErrors;
  if ((validationErrors = hasValidationErrors(res, schema, object))) {
    return validationErrors;
  }

  const { data, errors } = await execute(gql, { object }, req.headers);

  if (errors) {
    return res.status(400).json(errors[0]);
  }

  return res.json({
    ...data.insert_accounts_one
  });
};
