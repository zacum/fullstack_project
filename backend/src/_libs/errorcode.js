const errorCodes = {
  signin_email: {
    type: 'validation',
    errors: {
      email: `email doens't exist.`,
    },
  },
  signin_password: {
    type: 'validation',
    errors: {
      password: `password is'nt correct.`,
    },
  },
  signup_email: {
    type: 'validation',
    errors: {
      email: `email already exist.`,
    },
  },
};

module.exports = errorCodes;
