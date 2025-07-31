const pool = require("../../db");

async function testConnection() {
  const result = await pool.query("SELECT NOW()");
  console.log("Database Connected:", result.rows);
}
testConnection();

module.exports = (tasksRouter) => {
  //tähän täytyy lisätä tapa jolla saadaan lista niistä tehtävistä jotkä käyttäjä on tehnyt (ehkä get /id)
  tasksRouter.get('/', async (request, response) => {
    const result = await pool.query('SELECT * FROM tasks')
    // console.log(result.rows)

    response.json(result.rows)
  })


  tasksRouter.post('/', async (request, response) => {
    console.log('request data: ', request.body)
    if (request.body.title && request.body.description) {
      const result = await pool.query('INSERT INTO tasks (title, description) VALUES ($1, $2)', [request.body.title, request.body.description])
      response.status(200).json(result)
    }
    else {
      response.status(422).send({ error: 'Title or description missing' })
    }
  })

  tasksRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const result = await pool.query('DELETE FROM tasks WHERE id = ($1)', [id])
    console.log(result.rowCount);
    if (result.rowCount === 0) {
      response.status(400).end()
    }
    else {
      response.status(204).end()
    }
  })

  tasksRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const title = request.body.title
    const description = request.body.description

    const result = await pool.query("UPDATE tasks SET title = ($1), description = ($2) WHERE id = ($3)", [title, description, id])

    if (result.rowCount === 0) {
      console.log("ERROR: Unknown ID");
      response.status(422).send({ error: 'Unknown ID' })
    }
    else {
      response.json({ title: title, description: description })
    }
  })
};

