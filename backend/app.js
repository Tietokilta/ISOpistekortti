const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const middleWare = require('./utils/middleware')
const tasksRouter = require('./controllers/tasks')
const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/users')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(cookieParser())

app.use(middleWare.requestLogger)
//prevents the get favicon
app.use(middleWare.ignoreFavicon)

app.use('/api/login', loginRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/users', userRouter)


// All actions that require authentication should be placed after this middleware
app.use(middleWare.checkAuthToken)


//tähän väliin 

app.use(middleWare.unknownEndpoint)
app.use(middleWare.errorHandler)

module.exports = app
