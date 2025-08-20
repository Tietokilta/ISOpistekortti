const { isValidStatus } = require("../../utils/tasks/validation");
const { changeTaskUserStatus, getTaskUsersForUser } = require("../../utils/tasks/taskService");

module.exports = (adminRouter) => {
  adminRouter.get("/task_user/:userId", async (request, response) => {
    const userId = parseInt(request.params.userId, 10);
    if (Number.isNaN(userId)) {
      return response.status(400).json({ error: "userId must be an integer", });
    }

    try {
      const result = await getTaskUsersForUser(userId);
      if (result.rowCount === 0) {
        return response.status(404).json({ error: `User with id ${userId} not found`})
      }
      return response.status(200).json({ task_users: result.rows, });

    } catch(err) {
      console.error(err);
      return response.status(500).json( { error: "Internal server error" });
    }
  });

  adminRouter.patch("/task_user/:taskUserId", async (request, response) => {
    const taskUserId = parseInt(request.params.taskUserId, 10);
    if (Number.isNaN(taskUserId)) {
      return response.status(400).json({ error: "taskUserId must be an integer", });
    }

    const body = request.body;
    if (body.new_task_status == null) {
      return response.status(400).json({ error: "'new_task_status' missing from body", });
    }

    if (!isValidStatus(body.new_task_status)) {
      return response.status(400).json({
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
