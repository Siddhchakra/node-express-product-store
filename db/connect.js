const mongoose = require('mongoose');

const connectDB = (URL) =>
  mongoose.connect(URL).then(() => console.log('CONNECTED TO DB...'));

// mongoose
//   .connect(connectionString)
//   .then(() => console.log('CONNECTED TO DB...'))
//   .catch((err) => console.log(err));

module.exports = connectDB;
