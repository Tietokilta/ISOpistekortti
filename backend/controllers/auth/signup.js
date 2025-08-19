const bcrypt = require('bcrypt');
const pool = require('../../db');
const signupRouter = require('express').Router();
const { generateTokens } = require('../../utils/auth/tokenService');
const consts = require('../../utils/auth/consts');
const { validateUsername, validatePassword, validateRealname} = require("../../utils/users/validation");

function respondErrorIfValidationFailed(response, failedChecks) {
  if (failedChecks.length >= 1) {
    response.status(400).json({
      message: failedChecks[0],
    })
    return true;
  }

  return false;
}

signupRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body;

  if (username == null || name == null || password == null) {
    return res.status(400).json({ 
      error: 'Username, name, and password are required' 
    });
  }

  const failedRealnameChecks = validateRealname(name);
  if (respondErrorIfValidationFailed(res, failedRealnameChecks))
    return;

  const failedUsernameChecks = validateUsername(username);
  if (respondErrorIfValidationFailed(res, failedUsernameChecks))
    return;

  const failedPasswordChecks = validatePassword(password);
  if (respondErrorIfValidationFailed(res, failedPasswordChecks))
    return;

  try {
    const passwordHash = await bcrypt.hash(password, consts.SALT_ROUNDS);

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
    // Database unique constraint violation, username already taken
    if (error.code === '23505') { 
      return res.status(409).json({ 
        error: 'Username already taken' 
      });
    }

    console.error('Signup error:', error);
    res.status(500).json({ 
      error: 'Error creating user. Please try again.' 
    });
  }
});

module.exports = signupRouter;
