class ValidationError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "ValidationError";
    this.status = options.status || 422;
    this.code   = options.code   || "VALIDATION_ERROR";
    if (options.details) this.details = options.details; 
  }
}

class DatabaseError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "DatabaseError";
    this.status = options.status || 500;
    this.code   = options.code   || "DB_ERROR";
    if (options.cause) this.cause = options.cause;
  }
}

module.exports = { ValidationError, DatabaseError };
