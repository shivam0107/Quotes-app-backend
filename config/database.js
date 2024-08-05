const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB Successfully connected");
    })
    .catch((error) => {
      console.log("error occured", error);
      process.exit(1);
    });
};
