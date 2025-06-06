const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

const REFRESH_TOKEN_AGE_DAYS = 30;
const ACCESS_TOKEN_AGE_MINUTES = 15;
const SALT_ROUNDS = 12;

module.exports = {
  COOKIE_OPTIONS,
  REFRESH_TOKEN_AGE_DAYS,
  ACCESS_TOKEN_AGE_MINUTES,
  SALT_ROUNDS,
}


