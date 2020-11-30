const Joi = require('joi');
const execute = require('../execute');
const hasValidationErrors = require('../validate');

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
  description: Joi.string(),
  username: Joi.string().alphanum().required().messages({
    'string.alphanum': `Only letters and numbers allowed`
  }),
  fee_percent: Joi.number(),
  twitter: Joi.string(),
  facebook: Joi.string(),
  instagram: Joi.string(),
  user_id: Joi.string(),
  photo: Joi.string().uri()
});

module.exports = async function UpdateAccount(req, res) {
  const { id, object } = req.body.input;

  let validationErrors;
  if ((validationErrors = hasValidationErrors(res, schema, object))) {
    return validationErrors;
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
