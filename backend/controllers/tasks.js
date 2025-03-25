const tasksRouter = require('express').Router()
//const { default: knex } = require('knex');
require('../app');
const pool = require("../db");


async function testConnection() {
  const result = await pool.query("SELECT NOW()");
  console.log("Database Connected:", result.rows);
}
testConnection();

//tähän täytyy lisätä tapa jolla saadaan lista niistä tehtävistä jotkä käyttäjä on tehnyt (ehkä get /id)
tasksRouter.get('/', async (request, response) => {
  const result = await pool.query('SELECT * FROM tasks')
  //console.log(result.rows)

  response.json(result.rows)
})

//error handling puuttuu
tasksRouter.post('/', async (request, response) => {
  console.log('request data: ', request.body)
  const result = await pool.query('INSERT INTO tasks (title, description) VALUES ($1, $2)', [request.body.title, request.body.description])
  response.status(200).json(result)
})

//error handling puuttuu
tasksRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await pool.query('DELETE FROM tasks WHERE id = ($1)', [id])
  response.status(204).end()
})


//update


module.exports = tasksRouter