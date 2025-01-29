require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URL=process.env.MONGO_URL;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db is Connected");
  })
  .catch((error) => {
    console.log(error.message);
  });