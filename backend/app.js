
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleWare = require('./utils/middleware')

const tasksRouter = require('./controllers/tasks')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleWare.requestLogger)

app.use(express.json())
app.use('/api/tasks', tasksRouter)



//tähän väliin 

app.use(middleWare.unknownEndpoint)
app.use(middleWare.errorHandler)

module.exports = app
