
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleWare = require('./utils/middleware')

const tasksRouter = require('./controllers/tasks')

app.use(cors())
//app.use(express.static('dist'))
app.use(express.json())
app.use('/', tasksRouter)

const pool = require("./db");

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database Connected:", result.rows);
  } catch (err) {
    console.error("Database Connection Error:", err);
  }
}

testConnection();



module.exports = app
