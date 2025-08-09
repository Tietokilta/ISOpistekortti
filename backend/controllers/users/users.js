const usersRouter = require('express').Router()
const pool = require("../../db");
const { changePassword } = require("../../utils/users/userService");
const errors = require("../../utils/errors");
const consts = require("../../utils/auth/consts");

usersRouter.get("/user_info", async (request, response) => {
  const user = request.user;

  try {
    const result = await pool.query('SELECT name FROM users WHERE id = $1', [user.id]);
    if (result.rowCount === 0) {
      console.error(`User with id ${user.id} wasn't found in database, despite the given cookie having that user id`);
      return response.status(404).json({ error: `User with id ${user.id} not found` });
    }

    const userRealName = result.rows[0].name;

    return response.status(200).json({
      user_id: user.id,
      username: user.username,
      name: userRealName,
      is_admin: user.is_admin,
    });

  } catch (error) {
    console.error("Error fetching user info from DB: " + error)
    return response.status(500).json({ error: 'Internal server error' });
  }
});

usersRouter.post("/password", async (request, response) => {
  const user = request.user;
  const body = request.body

  if (body == null) {
    console.log("request did not have a body");
    return response.status(422).json({error: "Request doesn't have a body"});
  }

  const newPassword = body.password;
  if (newPassword == null) {
    console.log("Request did not have a password");
    return response.status(422).json({error: "Request does not have a password"});
  }

  try {
    await changePassword(user.id, newPassword);

    // Clear both auth tokens
    response.clearCookie('accessToken', {
      ...consts.COOKIE_OPTIONS,
    });

    response.clearCookie('refreshToken', {
      ...consts.COOKIE_OPTIONS,
    });
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

module.exports = usersRouter;
