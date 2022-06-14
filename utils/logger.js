module.exports = (req, res, next) => {
  const { url, method } = req;
  const time = new Date().getTime();

  console.log(method, url, time);

  //this method is passed by express.
  //below invoke is to avoid the infinite connection open
  //and pass the execution to next middleware.
  next();
};
