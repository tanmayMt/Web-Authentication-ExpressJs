require("dotenv").config();
const express = require("express");
const cors = require("cors");

const User = require("./models/user.model");

const app = express();
require("./config/database");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// home route
app.get("/", (req, res) => {
  res.send("<h1> Welcome to the server </h1>");
});

//server error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
