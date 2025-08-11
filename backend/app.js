const express = require('express')
require('express-async-errors')
const app = express()
const path = require("path");
const cors = require('cors')
const cookieParser = require('cookie-parser')
const middleWare = require('./utils/middleware')

// require('./controllers/tasks/task_user')
const tasksRouter = require('./controllers/tasks')
const usersRouter = require('./controllers/users/users')

const loginRouter = require('./controllers/auth/login')
const signupRouter = require('./controllers/auth/signup')
const logoutRouter = require('./controllers/auth/logout')
const adminRouter = require('./controllers/admin');

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use(middleWare.requestLogger)
//prevents the get favicon
app.use(middleWare.ignoreFavicon)

app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/signup', signupRouter)

app.use('/api/tasks', middleWare.checkAuthToken, tasksRouter)
app.use('/api/users', middleWare.checkAuthToken, usersRouter)

app.use('/api/admin', middleWare.checkAuthToken, middleWare.checkAdminPrivileges, adminRouter)

// Catch all other requests to /api/* here, so they don't get served the static site
app.use('/api', (req, res) => {
  return res.status(404).json({ error: 'Unknown endpoint', });
})

const frontendPath = process.env.FRONTEND_PATH
  ? path.resolve(process.env.FRONTEND_PATH)
  : path.resolve(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  return res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(middleWare.unknownEndpoint)
app.use(middleWare.errorHandler)

module.exports = app
