const pool = require("../../db");
const { isValidStatus, isValidStatusChange } = require("./validation");

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
    WHERE id = $2
    RETURNING *
  `, [new_status, task_user_id]);

  if (result.rowCount === 0) {
    throw new Error(`No task_user found with id ${task_user_id}`);
  }

  return result;
}

const createTask = async (title, description, needs_admin_approval) => {
  return await pool.query(`
    INSERT INTO tasks (title, description, needs_admin_approval)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [ title, description, needs_admin_approval ]);
};

const updateTask = async (task_id, title, description, needs_admin_approval) => {
  return await pool.query(`
    UPDATE tasks
    SET title = $1, description = $2, needs_admin_approval = $3
    WHERE id = $4
    RETURNING *
  `, [ title, description, needs_admin_approval, task_id ]);
};

const deleteTask = async (task_id) => {
  return await pool.query(`
    DELETE FROM tasks
    WHERE id = $1
  `, [ task_id ]);
};

const getTasks = async () => {
  return await pool.query(`
    SELECT *
    FROM tasks
  `);
};

module.exports = {
  changeTaskUserStatus,
  createTask,
  updateTask,
  deleteTask,
  getTasks,
};
