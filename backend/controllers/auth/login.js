const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const pool = require("../../db");
const { generateTokens } = require("./token_utils");
const consts = require("./consts");


// Login endpoint
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({
      error: 'Username and password are required'
    });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    const passwordCorrect = user 
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!passwordCorrect) {
      return response.status(401).json({
        error: 'Invalid username or password'
      });
    }


    const { accessToken, refreshToken } = await generateTokens(user);

    response.cookie('accessToken', accessToken, {
      ...consts.COOKIE_OPTIONS,
      maxAge: consts.ACCESS_TOKEN_AGE_MINUTES * 60 * 1000
    });

    response.cookie('refreshToken', refreshToken, {
      ...consts.COOKIE_OPTIONS,
      maxAge: consts.REFRESH_TOKEN_AGE_DAYS * 24 * 60 * 60 * 1000
    });

    response.status(200).json({
      user_id: user.id,
      username: user.username,
      name: user.name,
      is_admin: user.is_admin,
    });


  } catch (error) {
    console.error('Login error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }

});
module.exports = loginRouter
