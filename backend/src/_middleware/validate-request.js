module.exports = validateRequest;

function validateRequest(req, next, schema) {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    const errors = {};
    error.details.forEach(({ path, message }) => {
      const fieldName = path[0];
      if (!errors[fieldName]) errors[fieldName] = message;
    });
    next({
      type: 'validation',
      errors,
    });
  } else {
    req.body = value;
    next();
  }
}
