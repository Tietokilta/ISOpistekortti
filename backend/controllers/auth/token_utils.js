const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require("../../db");
const consts = require('./consts');

const generateTokens = async (user) => {
  const userForToken = {
    username: user.username,
    id: user.id,
    is_admin: user.is_admin,
  };

  // 15 minute access token
  const accessToken = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: consts.ACCESS_TOKEN_AGE_MINUTES.toString() + 'm' }
  );

  // Long lived refresh token
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + consts.REFRESH_TOKEN_AGE_DAYS);

  await pool.query(
    'INSERT INTO refresh_tokens (user_id, hashed_token, expires_at) VALUES ($1, $2, $3)',
    [user.id, hashedToken, expiresAt]
  );

  return { accessToken, refreshToken };
};

const checkRefreshToken = async (refreshToken) => {
  try {
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const result = await pool.query(
      `SELECT u.id, u.username, u.is_admin
       FROM users u
       JOIN refresh_tokens rt ON rt.user_id = u.id
       WHERE rt.hashed_token = $1 
         AND rt.expires_at > NOW()`,
      [tokenHash]
    );

    // No valid refresh token found
    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    return user;

  } catch (error) {
    console.error('Error getting refresh token: ' + error);
    return null;
  }
}

// Let errors be caught by caller
const deleteRefreshTokenFromDB = async(refreshToken) => {
  const tokenHash = crypto
  .createHash('sha256')
  .update(refreshToken)
  .digest('hex');

  await pool.query(
    'DELETE FROM refresh_tokens WHERE hashed_token = $1',
    [tokenHash]
  );
}

const refreshTokens = async (refreshToken, response) => {
  try {
    const user = await checkRefreshToken(refreshToken);
    // Invalid refresh token
    if (user === null) {
      return null;
    }

    // Delete old refresh token before making new ones
    await deleteRefreshTokenFromDB(refreshToken);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(user);
    response.cookie('accessToken', newAccessToken, {
      ...consts.COOKIE_OPTIONS,
      maxAge: consts.ACCESS_TOKEN_AGE_MINUTES * 60 * 1000
    });

    response.cookie('refreshToken', newRefreshToken, {
      ...consts.COOKIE_OPTIONS,
      maxAge: consts.REFRESH_TOKEN_AGE_DAYS * 24 * 60 * 60 * 1000
    });

    // Return user object for the middleware to use
    return {
      id: user.id,
      username: user.username,
      is_admin: user.is_admin,
    };

  } catch (error) {
    console.error('Error refreshing access token: ', error);
    return null;
  }
};

module.exports = {
  generateTokens,
  checkRefreshToken,
  deleteRefreshTokenFromDB,
  refreshTokens,
} 
