const tasksRouter = require('express').Router()


tasksRouter.get('/', async (request, response) => {
  console.log('get request to /api/tasks')
  //tässä haettaisiin tietokannasta lista tehtävistä käyttäjän ID perusteella
  const task = {
    name: 'auta fuksisitseillä',
    description: 'tule fuksisitseille tai niiden jatkoille töihin',
    completed: false,
    taskID: 1246717248123
  }
  response.json(task)
})


module.exports = tasksRouter