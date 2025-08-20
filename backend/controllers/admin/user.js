const { getAllUsersAndCompletedTasks, changeUserData, changePassword } = require("../../utils/users/userService");
const errors = require("../../utils/errors");

function isValidInt(val) {
  const num = Number(val);
  return (!Number.isNaN(num) && Number.isInteger(num));
}

module.exports = (adminRouter) => {

  adminRouter.get("/users", async (request, response) => {
    try {
      const result = await getAllUsersAndCompletedTasks();
      return response.status(200).json({ users: result.rows, });
    } catch (err) {
      console.error(err);
      return response.status(500).json( { error: "Internal server error" });
    }
  });

  adminRouter.put('/users/:userId', async (request, response) => {
    if (!isValidInt(request.params.userId)) {
      return response.status(400).json({ error: "Provided user id is not an integer"});
    }

    const body = request.body
    if (body == null) {
      console.log("request did not have a body");
      return response.status(400).json({error: "Request doesn't have a body"});
    }

    const { name, username, is_admin } = body;

    if (name == null || username == null || is_admin == null) {
      return response.status(400).json({ error: "Request body missing either 'name', 'username', or 'is_admin'" });
    }

    try {
      await changeUserData(request.params.userId, name, username, is_admin);
      return response.status(200).json({ message: "User updated successfully", user: { name, username, is_admin }, });

    } catch (error) {
      if (error instanceof errors.ValidationError) {
        return response.status(error.status).json({
          message: error.message,
          code: error.code,
          details: error.details
        });
      }

      console.log(error)
      return response.status(500).json({ error: "Internal server error" },);
    }
  });

  adminRouter.post('/users/:userId/password', async (request, response) => {
    if (!isValidInt(request.params.userId)) {
      return response.status(400).json({ error: "Provided user id is not an integer"});
    }

    const body = request.body
    if (body == null) {
      console.log("request did not have a body");
      return response.status(400).json({error: "Request doesn't have a body"});
    }

    const newPassword = body.password;
    if (newPassword == null) {
      console.log("Request did not have a password");
      return response.status(400).json({error: "Request does not have a password"});
    }

    try {
      await changePassword(request.params.userId, newPassword);
      return response.status(200).json({ message: "Password changed successfully", });

    } catch (error) {
      if (error instanceof errors.ValidationError) {
        return response.status(error.status).json({
          message: error.message,
          code: error.code,
          details: error.details
        });
      }

      console.log(error);
      return response.status(500).json({ error: "Internal server error" },);
    }
  });
};
