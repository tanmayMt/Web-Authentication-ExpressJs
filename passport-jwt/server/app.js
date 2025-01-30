require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
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

// register route
app.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).send("User already exists");
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      const newUser = new User({
        username: req.body.username,
        password: hash,
      });
      await newUser
        .save()
        .then((user) => {
          res.send({
            success: true,
            message: "User is created Successfully",
            user: {
              id: user._id,
              username: user.username,
            },
          });
        })
        .catch((error) => {
          res.send({
            success: false,
            message: "User is not created",
            error: error,
          });
        });
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(401).send({
      success: false,
      message: "User is not found",
    });
  }
  const match = bcrypt.compareSync(req.body.password, user.password);
  if (! match) {
    return res.status(401).send({
      success: false,
      message: "Incorrect password",
    });
  }
  return res.status(200).send({
    success: true,
    message: "User is logged in successfully"
  });
});

app.get("/profile", async (req, res) => {
  res.send("<h2>Profile</h2>");
});

//resource not found
app.use((req, res, next) => {
  res.status(404).json({
    message: "route not found",
  });
});

//server error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
