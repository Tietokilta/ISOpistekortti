const { getAllUsers, changeUsername, changePassword } = require("../../utils/users/userService");
const errors = require("../../utils/errors");

function isValidInt(val) {
  const num = Number(val);
  return (!Number.isNaN(num) && Number.isInteger(num));
}

module.exports = (adminRouter) => {

  adminRouter.get("/users", async (request, response) => {
    try {
      const result = await getAllUsers();
      return response.status(200).json({ users: result.rows, });
    } catch (err) {
      console.error(err);
      return response.status(500).json( { error: "Internal server error" });
    }
  });

  adminRouter.post('/users/:userId/username', async (request, response) => {
    if (!isValidInt(request.params.userId)) {
      return response.status(422).json({ error: "Provided user id is not an integer"});
    }

    const body = request.body
    if (!body) {
      console.log("request did not have a body");
      return response.status(422).json({error: "Request doesn't have a body"});
    }

    const newUsername = body.username;
    if (!newUsername) {
      console.log("Request did not have a username");
      return response.status(422).json({error: "Request does not have a username"});
    }

    try {
      await changeUsername(request.params.userId, newUsername);
      return response.status(200).json({ message: "Username changed successfully", });

    } catch (error) {
      if (error instanceof errors.ValidationError) {
        return response.status(error.status).json({
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
      return response.status(422).json({ error: "Provided user id is not an integer"});
    }

    const body = request.body
    if (!body) {
      console.log("request did not have a body");
      return response.status(422).json({error: "Request doesn't have a body"});
    }

    const newPassword = body.password;
    if (!newPassword) {
      console.log("Request did not have a password");
      return response.status(422).json({error: "Request does not have a password"});
    }

    try {
      await changePassword(request.params.userId, newPassword);
      return response.status(200).json({ message: "Password changed successfully", });

    } catch (error) {
      if (error instanceof errors.ValidationError) {
        return response.status(error.status).json({
          code: error.code,
          details: error.details
        });
      }

      console.log(error);
      return response.status(500).json({ error: "Internal server error" },);
    }
  });
};
