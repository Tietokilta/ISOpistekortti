const tasksRouter = require('./tasks');
const pool = require("../../db");
const consts = require("./consts");
const utils = require("./utils");


tasksRouter.get('/task_user', async (request, response) => {
  const user_id = request.user.id;

  try {
    const result = await pool.query(`
      SELECT t.id, tu.user_id, t.title, t.description, tu.status, t.needs_admin_approval
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

