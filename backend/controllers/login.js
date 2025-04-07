const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const pool = require("../db");


loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  let user = (await pool.query('SELECT * FROM users WHERE username = $1', [ username ])).rows;

  // Check if a user with the given username exists in the database. If not, set to null (caught after)
  if (user === undefined || user.length == 0) {
    user = null;
  } else {
    user = user[0];
  }

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET);

  // Set auth-token as a cookie in user's browser
  response.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  response
    .status(200)
    .send({username: user.username, name: user.name })
})

module.exports = loginRouter
