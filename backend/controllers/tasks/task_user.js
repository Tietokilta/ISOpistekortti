const pool = require("../../db");
const { changeTaskUserStatus } = require("../../utils/tasks/taskService");
const { isValidStatus, isValidStatusChange } = require("../../utils/tasks/validation");

module.exports = (tasksRouter) => {
  tasksRouter.get('/task_user', async (request, response) => {
    const user_id = request.user.id;

    try {
      const result = await pool.query(`
        SELECT tu.task_id, tu.user_id, t.title, t.description, tu.status, t.needs_admin_approval
        FROM tasks t
        INNER JOIN task_user tu
        ON t.id = tu.task_id
        WHERE tu.user_id = $1;
      `, [user_id]);

      return response.status(200).json(result.rows);
    } catch (err) {
      console.log("Error: " + err);
      return response.status(500).json({
        error: 'An unexpected error occured',
      });
    }
  });

  tasksRouter.post('/task_user', async (request, response) => {
    const body = request.body
    if (body == null) {
      console.log("request did not have a body");
      return response.status(422).json({error: "Request is missing a body"});
    }

    const task_id = body.task_id;
    const new_task_status = body.new_task_status;
    const user = request.user;

    if (task_id == null || new_task_status == null) {
      console.log("'body.task_id', or 'body.new_task_status' missing");
      return response.status(422).json({error: "Body is missing 'task_id' or 'new_task_status'"});
    }

    if (!isValidStatus(new_task_status)) {
      return response.status(422).json({
        error: "Given status is not a valid status",
      });
    }

    try {
      const result = await pool.query(`
        SELECT t.needs_admin_approval, tu.status, tu.id AS task_user_id
        FROM tasks t
        INNER JOIN task_user tu
        ON t.id = tu.task_id
        WHERE tu.user_id = $1 AND t.id = $2;
      `, [user.id, task_id]);

      const task_info = result.rows[0];

      if (!task_info) {
        console.log(`No task id ${task_id} found for user id ${user.id}`);
        return response.status(404).json({
          error: 'Task not found',
        });
      }

      // If user is not an admin, check for validity of the status change
      if (!user.is_admin) {
        try {
          isValidStatusChange(task_info, new_task_status);
        } catch (err) {
          console.log("Invalid status change: " + err.message);
          return response.status(err.status).json({
            error: err.message,
          });
        }
      }

      // User is an admin or the status change is valid, execute it
      await changeTaskUserStatus(task_info.task_user_id, new_task_status);

      // Success
      return response.status(200).json({
        message: `task_user id ${task_info.task_user_id} status changed successfully`,
      });

    } catch (err) {
      console.log("Error: " + err);
      return response.status(500).json({
        error: 'An unexpected error occured',
      });
    }
  });
};
