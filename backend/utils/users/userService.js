const ld = require("lodash");
const { validateUsername, validatePassword, validateRealname } = require("./validation");
const { invalidateUserRefreshTokens } = require("../auth/tokenService");
const bcrypt = require('bcrypt');
const errors = require("../errors");
const pool = require('../../db');
const authConsts = require('../auth/consts');
const taskConsts = require("../tasks/consts");

async function getAllUsersAndCompletedTasks() {
  return await pool.query(`
    SELECT u.id, username, u.name, u.is_admin, COUNT(tu.id) AS completed_tasks
    FROM users u
    LEFT JOIN task_user tu
    ON tu.user_id = u.id AND tu.status = $1
    GROUP BY u.id
    ORDER BY completed_tasks DESC;
  `, [taskConsts.TASK_STATUS.DONE]);
}

function throwIfValidationFailed(message, failedChecks, errorCode) {
  if (failedChecks.length === 0) return;

  throw new errors.ValidationError(
    message,
    { code: errorCode, details: failedChecks, }
  );
}

async function changeUserData(userId, newName, newUsername, newIsAdmin) {
  const failedUsernameChecks = validateUsername(newUsername);
  throwIfValidationFailed(`"${newUsername}" is not a valid username`, failedUsernameChecks, "INVALID_USERNAME");

  const failedRealnameChecks = validateRealname(newName);
  throwIfValidationFailed(`"${newName}" is not a valid name`, failedRealnameChecks, "INVALID_NAME");

  if (!ld.isBoolean(newIsAdmin)) {
    throw new errors.ValidationError(
      "New admin value is not a boolean",
      { status: 400, }
    );
  }

  try {
    const result = await pool.query(`
      UPDATE users
      SET username = $1, name = $2, is_admin = $3
      WHERE id = $4;
    `, [newUsername, newName, newIsAdmin, userId]);

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

async function changeUsername(userId, newUsername) {
  const failedUsernameChecks = validateUsername(newUsername);
  throwIfValidationFailed(`"${newUsername}" is not a valid username`, failedUsernameChecks, "INVALID_USERNAME");

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
  throwIfValidationFailed(`Invalid password`, failedPasswordChecks, "INVALID_PASSWORD");

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
  getAllUsersAndCompletedTasks,
  changeUsername,
  changePassword,
  changeUserData,
};
