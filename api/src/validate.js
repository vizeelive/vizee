 function validate(res, schema, object) {
  let errors = false;
  let validationErrors = schema.validate(object, { abortEarly: false });
  if (validationErrors.error) {
   console.log(validationErrors.error);
   let out = {};
   console.log(validationErrors.error.details);
   validationErrors.error.details.forEach(e => {
    let key = e.path.join('.');
    out[key] = e.message;
   });
   errors = res.status(400).json({ code: 'validation-error', message: JSON.stringify(out) });
  }
  return errors;
 }

 module.exports = validate;
