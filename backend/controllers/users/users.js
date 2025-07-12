const usersRouter = require('express').Router()
const pool = require("../../db");

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

module.exports = usersRouter;
