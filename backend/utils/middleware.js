//error handling ja pyyntöjen logger tänne
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  return response.status(400).send({ error: 'see console'})

  next(error)
}

const checkAuthToken = (request, response, next) => {
  const authToken = request.cookies?.authToken;

  if (!authToken) {
    return response.status(401).json({ error: 'Invalid authorization token' });
  }

  try {
    const verifiedUser = jwt.verify(authToken, process.env.SECRET);
    request.user = verifiedUser
    next()

  } catch (err) {
    return response.status(401).json({ error: 'Invalid authorization token' });
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  checkAuthToken
}
