const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  // Log to console for dev
  console.log(err);

  error.message = err.message;

  switch (error.name) {
    case 'CastError':
      error = new ErrorResponse(
        `Bootcamp not found with id of ${error.value}`,
        404
      );
      break;
    case 'ReferenceError':
      error = new ErrorResponse(
        `Bootcamp id of ${error.value} formatted incorrectly`,
        404
      );
      break;
    case 'ValidationError':
      error = new ErrorResponse(
        `${Object.values(error.errors).map((val) => val.message)}`,
        400
      );
      break;
  }
  if (error.code == 11000) {
    console.log('this is it!');
    error = new ErrorResponse(
      `Duplicate Bootcamp: "${error.keyValue['name']}"`,
      400
    );
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message,
  });
};

module.exports = errorHandler;
