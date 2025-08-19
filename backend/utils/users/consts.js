const PASSWORD_CHECKS = [
  {checkFn: (pw) => { return /[A-Z]/.test(pw); }, message: "Password must have at least one uppercase letter"},
  {checkFn: (pw) => { return /[a-z]/.test(pw); }, message: "Password must have at least one lowercase letter"},
  {checkFn: (pw) => { return /[0-9]/.test(pw); }, message: "Password must have at least one number"},
  {checkFn: (pw) => { return /.{8}/.test(pw); }, message: "Password must have at least 8 characters"},
];

const USERNAME_CHECKS = [
  {checkFn: (username) => { return username.length >= 3 }, message: "Username must be at least 3 characters long"},
  {checkFn: (username) => { return username.length <= 20 }, message: "Username must be at most 20 characters long"},
  {checkFn: (username) => { return /^[a-zA-Z0-9_]+$/.test(username) }, message: "Username must consist only of alphanumeric characters and underscores"},
  {checkFn: (username) => { return /^[a-zA-Z]/.test(username) }, message: "Username must start with a letter"},
];

const REALNAME_CHECKS = [
  {checkFn: (realname) => { return realname.length <= 200 }, message: "Name must be at most 200 characters long"},
]

module.exports = {
  PASSWORD_CHECKS,
  USERNAME_CHECKS,
  REALNAME_CHECKS,
}
