const { isValidStatus } = require("../../utils/tasks/validation");
const { changeTaskUserStatus } = require("../../utils/tasks/taskService");

module.exports = (adminRouter) => {
  adminRouter.patch("/task_user/:task_user_id", async (request, response) => {
    const taskUserId = parseInt(request.params.task_user_id, 10);
    if (Number.isNaN(taskUserId)) {
      return response.status(400).json({ error: "task_user_id must be an integer", });
    }

    const body = request.body;
    if (body.new_task_status == null) {
      return response.status(400).json({ error: "'new_task_status' missing from body", });
    }

    if (!isValidStatus(body.new_task_status)) {
      return response.status(422).json({
        error: "Given status is not a valid status",
      });
    }

    try {
      const result = await changeTaskUserStatus(taskUserId, body.new_task_status);
      console.log(result)
      if (result.rowCount === 0) {
        return response.status(404).json({ error: `task_user with id ${taskUserId} not found`});
      }

      return response.status(200).json({ task_user: result.rows[0], });
    } catch (err) {
      console.error(err);
      return response.status(500).json( { error: "Internal server error" });
    }
  });
};
