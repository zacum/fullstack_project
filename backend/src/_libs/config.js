const dotenv = require('dotenv');
dotenv.config();

const env = (key, defaultValue) => {
  if (process.env[key] === undefined) {
    return defaultValue;
  }
  return process.env[key];
};

module.exports = {
  database: {
    driver: env('DB_DRIVER', 'mysql'),
    host: env('DB_HOST', 'localhost'),
    port: env('DB_PORT', '3306'),
    user: env('DB_USER', 'root'),
    password: env('DB_PASSWORD', ''),
    database: env('DB_DATABASE', 'gunbot_config'),
  },
  secret: env('JWT_SECRET', 'GuntharDeNiro-CreditFirst-MuranoTakashi'),
  expiresIn: env('JWT_EXPIRES_IN', '2d'),
};
