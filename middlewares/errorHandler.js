const { CustomError } = require('../utils/customError');

const errorHandler = (err, req, res, next) => {
  console.log(err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try againg later.'
  });
};

module.exports = errorHandler;
