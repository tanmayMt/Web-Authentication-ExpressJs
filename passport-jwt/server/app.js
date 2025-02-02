require("dotenv").config();
require("./config/passport");

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("./models/user.model");
const jwt = require('jsonwebtoken');
const passport = require("passport");

const app = express();
require("./config/database");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());


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

  //if user and password both is verified than we can genarate a token and loggin successfully
  // https://www.npmjs.com/package/jsonwebtoken
  const payload = {
    id: user._id,
    username: user.username,
  };
  // Generate a JWT token using the payload and secret key
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "2d",// Token will expire in 2 days
  });

  return res.status(200).send({
    success: true,
    message: "User is logged in successfully",
    token: "Bearer " + token, // Attach the generated JWT token with "Bearer" prefix for authentication
  });
});


// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).send({
//       success: false,
//       message: "Username and password are required",
//     });
//   }

//   const user = await User.findOne({ username });
//   if (!user) {
//     return res.status(401).send({
//       success: false,
//       message: "User not found",
//     });
//   }

//   const match = bcrypt.compareSync(password, user.password);
//   if (!match) {
//     return res.status(401).send({
//       success: false,
//       message: "Incorrect password",
//     });
//   }

//   const payload = {
//     id: user._id,
//     username: user.username,
//   };
//   const token = jwt.sign(payload, process.env.SECRET_KEY, {
//     expiresIn: "2d",
//   });

//   return res.status(200).send({
//     success: true,
//     message: "User logged in successfully",
//     token: "Bearer " + token,
//   });
// });


// {
//     "success": true,
//     "message": "User is logged in successfully",
//     "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OWI1Nzk2Zjk4N2UzNTljMGNiYTVlYSIsInVzZXJuYW1lIjoicXciLCJpYXQiOjE3MzgyMzM3ODgsImV4cCI6MTczODQwNjU4OH0.n2cif1k8DC8zE6LM1EUWOjsBGKBaJmSshGyoDKnlAPw"
// }
//when user sent a requtest to the server with token, than server will cheack the validation of this token
//To validate this token we will use password-jwt https://www.passportjs.org/packages/passport-jwt/
// we will do that authentication part at config/passport.js file


// app.get("/profile", async (req, res) => {
//   res.send("<h2>Profile</h2>");
// });
 
// profile route
app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    return res.status(200).send({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
      },
    });
  }
);

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
