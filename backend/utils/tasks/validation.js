const consts = require("./consts");
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
    case consts.TASK_STATUS.REJECTED: {
      if (task_info.needs_admin_approval) {
        error.message = "Cannot change status of a rejected task which needs admin approval";
        throw error;
      }

      if (new_status !== consts.TASK_STATUS.DONE) {
        error.message = "Cannot set a rejected task which doesn't need admin approval to anything but 'done'";
        throw error;
      }

      break;
    }

    case consts.TASK_STATUS.NOT_DONE: {
      if (task_info.needs_admin_approval && new_status !== consts.TASK_STATUS.REQUESTING) {
        error.message = "A not_done task which requires admin approval can only be set to 'requesting'";
        throw error;

      } else if (!task_info.needs_admin_approval && new_status !== consts.TASK_STATUS.DONE) {
        error.message = "A not_done task which doesn't require admin approval can only be set to 'done'";
        throw error;
      }

      break;
    }
  };
}

module.exports = {
  isValidStatus,
  isValidStatusChange,
};
