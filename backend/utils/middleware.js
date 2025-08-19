//error handling ja pyyntöjen logger tänne
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { refreshTokens } = require('./auth/tokenService');

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const isProdEnvironment = process.env.NODE_ENV == 'production';
const requestLogger = (request, response, next) => {
  if (!isProdEnvironment) {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  return response.status(400).send({ error: 'see console'})

  next(error)
}


const checkAuthToken = async (request, response, next) => {
  const { accessToken, refreshToken } = request.cookies;
  
  // Try access token
  if (accessToken) {
    try {
      request.user = jwt.verify(accessToken, process.env.JWT_SECRET);
      return next();
    } catch (err) {
      // Expired or invalid access token, try to refresh below
    }
  }

  if (refreshToken) {
    const user = await refreshTokens(refreshToken, response);
    if (user) {
      request.user = user;
      return next();
    }
  }

  // No valid tokens
  return response.status(401).json({ error: 'Authentication required' });
};

const checkAdminPrivileges = async (request, response, next) => {
  if (!request.user.is_admin) {
    return response.status(401).json({error: 'Admin privileges required'});
  }

  return next();
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  checkAuthToken,
  checkAdminPrivileges,
}
