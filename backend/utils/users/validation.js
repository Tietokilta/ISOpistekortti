const consts = require("./consts");

function validateInput(input, inputName, inputTypeShouldBe, checks) {
  if (typeof input !== inputTypeShouldBe) {
    return [ `${inputName} must be a ${inputTypeShouldBe}` ];
  }

  var failedChecks = [];
  for (const { checkFn, message} of checks) {
    if (!checkFn(input)) {
      failedChecks.push(message);
    }
  }

  return failedChecks;
}

function validateUsername(username) {
  return validateInput(username, "Username", "string", consts.USERNAME_CHECKS);
}

function validatePassword(password) {
  return validateInput(password, "Password", "string", consts.PASSWORD_CHECKS);
}

function validateRealname(realname) {
  return validateInput(realname, "Name", "string", consts.REALNAME_CHECKS);
}

module.exports = {
  validatePassword,
  validateUsername,
  validateRealname,
}
