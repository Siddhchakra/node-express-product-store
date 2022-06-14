const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      //This will call the next middleware i.e. 'errorHandler'.
      next(error);
    }
  };
};

module.exports = asyncWrapper;
