const bcrypt = require('bcrypt');
const pool = require('../../db');
const signupRouter = require('express').Router();
const { generateTokens } = require('./token_utils');
const consts = require('./consts');

signupRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !name || !password) {
    return res.status(400).json({ 
      error: 'Username, name, and password are required' 
    });
  }

  // NOTE: Could add validation for username and password meeting some constraints

  try {
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Username already taken' 
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      `INSERT INTO users (username, name, "passwordHash")
       VALUES ($1, $2, $3) 
       RETURNING id, username, is_admin`,
      [username, name, passwordHash]
    );

    const user = newUser.rows[0];

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    // Set cookies
    res.cookie('accessToken', accessToken, {
      ...consts.COOKIE_OPTIONS,
      maxAge: consts.ACCESS_TOKEN_AGE_MINUTES * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      ...consts.COOKIE_OPTIONS,
      maxAge: consts.REFRESH_TOKEN_AGE_DAYS * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user info (without password)
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        is_admin: user.is_admin,
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    // Handle specific database errors
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ 
        error: 'Username already taken' 
      });
    }

    res.status(500).json({ 
      error: 'Error creating user. Please try again.' 
    });
  }
});

module.exports = signupRouter;
