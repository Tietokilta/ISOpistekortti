const tasksRouter = require('express').Router()

require("./tasks")(tasksRouter);
require("./task_user")(tasksRouter);

module.exports = tasksRouter;
