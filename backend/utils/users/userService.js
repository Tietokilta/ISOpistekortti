const { validateUsername, validatePassword } = require("./validation");
const bcrypt = require('bcrypt');
const errors = require("../errors");
const pool = require('../../db');
const authConsts = require('../../controllers/auth/consts');

async function changeUsername(userId, newUsername) {
  const failedUsernameChecks = validateUsername(newUsername);
  if (failedUsernameChecks.length >= 1) {
    throw new errors.ValidationError(
      `"${newUsername}" is not a valid username`,
      { code: "INVALID_USERNAME", details: failedUsernameChecks, }
    );
  }

  const existingUser = await pool.query(
    'SELECT id FROM users WHERE username = $1',
    [newUsername]
  );

  if (existingUser.rows.length > 0) {
    throw new errors.ValidationError(
      `"${newUsername}" is already taken`,
      { code: "USERNAME_TAKEN", }
    );
  }

  const result = await pool.query(
    `UPDATE users
    SET username = $1
    WHERE id = $2`,
    [newUsername, userId]
  );

  if (result.affectedRows === 0) {
    throw new errors.ValidationError(
      `User with id "${userId}" does not exist`,
      { code: "NONEXISTENT_USER" }
    );
  }
}

async function changePassword(userId, newPassword) {
  const failedPasswordChecks = validatePassword(newPassword);

  if (failedPasswordChecks.length >= 1) {
    throw new errors.ValidationError(
      `Invalid password`,
      { code: "INVALID_PASSWORD", details: failedPasswordChecks, }
    );
  }

  const newPasswordHash = await bcrypt.hash(newPassword, authConsts.SALT_ROUNDS);

  const result = await pool.query(
    `UPDATE users
    SET "passwordHash" = $1
    WHERE id = $2`,
    [newPasswordHash, userId]
  );

  if (result.affectedRows === 0) {
    throw new errors.ValidationError(
      `User with id "${userId}" does not exist`,
      { code: "NONEXISTENT_USER" }
    );
  }
}

module.exports = { changeUsername, changePassword };
