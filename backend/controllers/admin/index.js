const adminRouter = require('express').Router()

require("./user")(adminRouter);
require("./tasks")(adminRouter);
require("./task_user")(adminRouter);

module.exports = adminRouter;
