const taskService = require("../../utils/tasks/taskService");
const consts = require("../../utils/tasks/consts");
const pool = require("../../db");

function isValidInt(val) {
  const num = Number(val);
  return (!Number.isNaN(num) && Number.isInteger(num));
}

module.exports = (adminRouter) => {
  adminRouter.post("/tasks", async (request, response) => {
    const body = request.body;
    if ( body.title == null || body.description == null || body.needs_admin_approval == null ) {
      return response.status(400).send({ error: "'title', 'description', or 'needs_admin_approval' missing from body" });
    }

    if (typeof body.needs_admin_approval !== "boolean") {
      return response.status(400).json({ error: "'needs_admin_approval' must be a boolean"});
    }

    try {
      const result = await taskService.createTask(body.title, body.description, body.needs_admin_approval);
      return response.status(201).json(result.rows[0]);

    } catch (err) {
      console.error(err);
      return response.status(500).json( { error: "Internal server error" });
    }
  });

  adminRouter.put("/tasks", async (request, response) => {
    const body = request.body;

    if ( body.task_id == null || body.title == null || body.description == null || body.needs_admin_approval == null ) {
      return response.status(400).json({ error: "Missing 'task_id', 'title', 'description', or 'needs_admin_approval' from request"});
    }

    if (typeof body.needs_admin_approval !== "boolean") {
      return response.status(400).json({ error: "'needs_admin_approval' must be a boolean"});
    }

    try {
      const result = await taskService.updateTask(body.task_id, body.title, body.description, body.needs_admin_approval);
      if (result.rowCount === 0) {
        return response.status(404).json({ error: `Task with id ${body.task_id} not found`});
      }

      return response.status(201).json(result.rows[0]);

    } catch (err) {
      console.error(err);
      return response.status(500).json( { error: "Internal server error" });
    }
  });

  adminRouter.delete("/tasks/:taskId", async (request, response) => {
    const taskId = request.params.taskId
    if (!isValidInt(taskId)) {
      return response.status(400).json({ error: "Provided task id is not an integer"});
    }

    try {
      const result = await taskService.deleteTask(taskId);
      if (result.rowCount === 0) {
        return response.status(404).json({ error: `Task with id ${taskId} not found`});
      }

      return response.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
      console.error(err);
      return response.status(500).json( { error: "Internal server error" });
    }

  });

  adminRouter.get("/tasks", async (request, response) => {
    try {
      const result = await taskService.getTasks();
      return response.status(200).json( { tasks: result.rows, } );
    } catch (err) {
      console.error(err);
      return response.status(500).json( { error: "Internal server error" });
    }
  });

  adminRouter.get("/requested_tasks", async (request, response) => {
    try {
      const result = await pool.query(`
        SELECT u.id AS user_id, u.username, u.name, 
               t.id AS task_id, t.title AS task_title
               tu.id AS task_user_id
        FROM users u
        INNER JOIN task_user tu
        ON tu.user_id = u.id
        INNER JOIN tasks t
        ON tu.task_id = t.id
        WHERE tu.status = $1
      `, [ consts.TASK_STATUS.REQUESTING ]);

      return response.status(200).json({
        requested_tasks: result.rows,
      })

    } catch (err) {
      console.error(err);
      return response.status(500).json( { error: "Internal server error" });
    }
  });
};
