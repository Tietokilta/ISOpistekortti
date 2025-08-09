const logoutRouter = require('express').Router()
const consts = require('../../utils/auth/consts');
const { deleteRefreshTokenFromDB } = require('../../utils/auth/tokenService');

// Logout endpoint, clears cookies and invalidates refresh token
logoutRouter.post('/', async (request, response) => {
  const { refreshToken } = request.cookies;

  try {
    // If refresh token exists, delete it from database
    if (refreshToken != null) {
      await deleteRefreshTokenFromDB(refreshToken);
    }

    // Clear both cookies
    response.clearCookie('accessToken', {
      ...consts.COOKIE_OPTIONS,
    });

    response.clearCookie('refreshToken', {
      ...consts.COOKIE_OPTIONS,
    });

    response.status(200).json({ message: 'Logged out successfully' });

  } catch (error) {
    // If database operation failed, clear accessToken but keep refresh token so that user still has access to it
    // If it's deleted from the user but not the database, user has no way to invalidate token anymore
    response.clearCookie('accessToken', {
      ...consts.COOKIE_OPTIONS,
    });

    response.status(500).json({ 
      error: 'Logout failed. Please try again.',
      message: 'Your refresh token is still active. Please retry logout.'
    });
  }
});

module.exports = logoutRouter
