// This class AppError, and we actually want all of our AppError objects to then inherit from the built-in Error.

class AppError extends Error {
  constructor(message, statusCode) {
    // called super to call parents constructor; message property to our icoming message
    super(message);

    this.statusCode = statusCode;
    // statusCode with 4 is fail and 5 error 
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // to track where is the error happen
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
