const { validateUsername, validatePassword } = require("./validation");
const { invlidateUserRefreshTokens, invalidateUserRefreshTokens } = require("../auth/tokenService");
const bcrypt = require('bcrypt');
const errors = require("../errors");
const pool = require('../../db');
const authConsts = require('../auth/consts');

async function getAllUsers() {
  return await pool.query(`
    SELECT id, username, name, is_admin
    FROM users
  `)
}

async function changeUsername(userId, newUsername) {
  const failedUsernameChecks = validateUsername(newUsername);
  if (failedUsernameChecks.length >= 1) {
    throw new errors.ValidationError(
      `"${newUsername}" is not a valid username`,
      { code: "INVALID_USERNAME", details: failedUsernameChecks, }
    );
  }

  try {
    const result = await pool.query(
      `UPDATE users
      SET username = $1
      WHERE id = $2`,
      [newUsername, userId]
    );

    if (result.rowCount === 0) {
      throw new errors.ValidationError(
        `User with id "${userId}" does not exist`,
        { code: "NONEXISTENT_USER" }
      );
    }
  } catch(err) {
    // Database unique constraint violation, username already taken
    if (err.code === '23505') { 
      throw new errors.ValidationError(
        `"${newUsername}" is already taken`,
        { 
          code: "USERNAME_TAKEN",
          status: 409,
        }
      );
    }

    throw err;
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

  // Change password -> Log out all sessions. The 15 minute access tokens stay valid,
  // but after they expire, user is logged out
  await invalidateUserRefreshTokens(userId);

  const newPasswordHash = await bcrypt.hash(newPassword, authConsts.SALT_ROUNDS);

  const result = await pool.query(
    `UPDATE users
    SET "passwordHash" = $1
    WHERE id = $2`,
    [newPasswordHash, userId]
  );

  if (result.rowCount === 0) {
    throw new errors.ValidationError(
      `User with id "${userId}" does not exist`,
      { code: "NONEXISTENT_USER" }
    );
  }
}

module.exports = { 
  getAllUsers,
  changeUsername,
  changePassword,
};
