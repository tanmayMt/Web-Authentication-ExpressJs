require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// Hashing password

// - no cncryption key; we will use hashing algorithm
// - hackers can not convert to plain text as no encryption key is available
// - md5 package: https://www.npmjs.com/package/md5
// - install md5 npm package: `npm install md5`
// - usage

const md5 = require("md5"); // Import md5 library for hashing

// Example of hashing a message using md5
console.log(md5("message"));
const User = require("./models/user.model");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

//connect mongodb
mongoose
  .connect(MONGO_URL)
  .then(()=>{
    console.log("mongodb is connected")
  })
  .catch((error)=>{
    console.log(error);
    process.exit(1);
  })

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Home Route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/./views/index.html");
});

app.post("/register",async(req,res)=>{
    try{
        const newUser =  User({
          email: req.body.email,
          password: md5(req.body.password), // Hash the password using md5 before storing it
        });
        await newUser.save();
        res.status(201).send({
            success:true,
            message:"Registeration Successfull",
            data:newUser
        })
    }
    catch(error){
    res.status(500).json(error.message);
  }
})

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = md5(req.body.password);
    // Find the user in the database by email
    const user = await User.findOne({ email: email });

    // Check if the user exists and if the provided password matches the stored password
    if (user && user.password === password) {// If valid, send a success response
      res.status(200).send({
        success:true,
        message: "Valid User",
        data:user
      });
    } else {
      res.status(404).json({ status: `${email} not valid user` }); // If invalid, send a "Not valid user" response
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// route not found error
app.use((req, res, next) => {
  res.status(404).json({
    message: "route not found",
  });
});

//handling server error
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "something broke",
  });
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});