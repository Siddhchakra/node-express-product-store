//DB Connection
require('./db/connect');
require('dotenv').config();

const express = require('express');
const app = express();
const productsRoute = require('./routes/products');
const morgan = require('morgan');
const connectDB = require('./db/connect');
const custom404 = require('./middlewares/custom404');
const errorHandler = require('./middlewares/errorHandler');

app.use('/api', morgan('combined'));

//This middleware is MANDATORY to make the request body available in 'req.body'
app.use('/api', express.json());

//By this we remove '/api/products' from the METHODS URL in route file.
app.use('/api/products', productsRoute);

// Below TWO custom middlewares should always to be after the routes.
//This renders custom message for 404 APIs
app.use(custom404);

//This error handler is used to log or send the error from one place
app.use(errorHandler);

const port = process.env.EXPRESS_PORT || 5000;

(async () => {
  try {
    //DB Connection
    await connectDB(process.env.MONGO_DB_URI);

    //Server
    app.listen(port, () => {
      console.log(`Server has started on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
})();
