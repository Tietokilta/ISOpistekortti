const consts = require("./consts");

function validateUsername(username) {
  if (typeof username !== "string") {
    return ["Username must be a string"];
  }

  var failedChecks = [];
  for (const { checkFn, message } of consts.USERNAME_CHECKS) {
    if (!checkFn(username)) {
      failedChecks.push(message)
    }
  }

  return failedChecks;
}

function validatePassword(password) {
  if (typeof password !== "string") {
    return ["Password must be a string"];
  }

  var failedChecks = [];
  for (const { checkFn, message } of consts.PASSWORD_CHECKS) {
    if (!checkFn(password)) {
      failedChecks.push(message)
    }
  }

  return failedChecks;
}

module.exports = {
  validatePassword,
  validateUsername,
}
