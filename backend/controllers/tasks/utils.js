const consts = require("./consts");
const pool = require("../../db");

// Check if `status` is valid
function isValidStatus(status) {
  return Object.values(consts.TASK_STATUS).includes(status);
}

// Check if a status change is valid to be done by a non-admin user. Throws an error to be caught in the
// caller's function if it is invalid
function isValidStatusChange(task_info, new_status) {
  const error = new Error();
  error.status = 400;

  switch(task_info.status) {
    // No need for changes, OK
    case new_status: {
      error.message = "Old and new status match, no need for changes";
      throw error;
    }

    case consts.TASK_STATUS.DONE: {
      if (task_info.needs_admin_approval) {
        error.message = "Cannot change status of an admin approved task";
        throw error;
      }

      if (new_status !== consts.TASK_STATUS.NOT_DONE) {
        error.message = "Cannot set a done task to 'requesting' or 'rejected'";
        throw error;
      }

      break;
    }

    case consts.TASK_STATUS.REQUESTING: {
      if (new_status !== consts.TASK_STATUS.NOT_DONE) {
        error.message = "Cannot change a task awaiting approval to anything but 'not_done'";
        throw error;
      }

      break;
    }

    // rejected acts the same as not done, so fall through
    case consts.TASK_STATUS.REJECTED:
    case consts.TASK_STATUS.NOT_DONE: {
      if (task_info.needs_admin_approval && new_status !== consts.TASK_STATUS.REQUESTING) {
        error.message = "A not_done or rejected task which requires admin approval can only be set to 'requesting'";
        throw error;

      } else if (!task_info.needs_admin_approval && new_status !== consts.TASK_STATUS.DONE) {
        error.message = "A not_done or rejected task which doesn't require admin approval can only be set to 'done'";
        throw error;
      }

      break;
    }
  };

}

// Changes the status of `task_user` with given id to `new_status`
// Does not check for whether the change is valid, and assumes the caller has already checked
// Does check whether given `new_status` is a valid status
// Does not catch errors, expects caller to catch
async function changeTaskUserStatus(task_user_id, new_status) {
  if (!isValidStatus(new_status)) {
    throw new Error(`Given 'new_status': ${new_status} is not a valid status`);
  }

  const result = await pool.query(`
    UPDATE task_user
    SET status = $1
    WHERE id = $2;
  `, [new_status, task_user_id]);

  if (result.rowCount === 0) {
    throw new Error(`No task_user found with id ${task_user_id}`);
  }
}

module.exports = {
  isValidStatus,
  isValidStatusChange,
  changeTaskUserStatus,
}

