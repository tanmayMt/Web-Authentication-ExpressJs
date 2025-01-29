require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// hashing + salting password
// Hashing transforms a password into a fixed-length encrypted value for secure storage. Salting adds a unique random string to each password before hashing to make the hash unique, even for identical passwords. bcrypt combines both processes, ensuring strong protection against brute force, dictionary, and rainbow table attacks.
const bcrypt = require("bcrypt");
const saltRounds = 10;


// const md5 = require("md5"); // Import md5 library for hashing

//// Example of hashing a message using md5
// console.log(md5("message"));
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
// During user registration, the bcrypt.hash() function is used to hash the user's password with a defined number of salt rounds (saltRounds).
// The hashed password is stored in the database to ensure sensitive data isn't saved in plain text.
    try{
        // Hash the user's password before saving it to the database
        bcrypt.hash(req.body.password,saltRounds, async function (err, hash){
            // Create a new user with the hashed password
            const newUser = new User({
                email: req.body.email,// Assign the email provided in the request
                password: hash // Store the securely hashed password
            });
            await newUser.save();
            res.status(201).send({success:true,message:"Registeration Successfull",data:newUser});
        })
    }
    catch(error){
    res.status(500).json(error.message);
  }
})

app.post("/login", async (req, res) => {
// During login, the bcrypt.compare() function compares the provided plain-text password with the hashed password stored in the database.
// If the comparison is successful, the user is authenticated. If not, an error response is sent.
  try {
    const email = req.body.email;
    const password = req.body.password;
    // Find the user in the database by email
    const user = await User.findOne({ email: email });

    // Check if the user exists and if the provided password matches the stored password
    if (user) {
        bcrypt.compare(password, user.password,function (err, result){
            if (result === true) {
                res.status(200).send({success:true,message: "Valid User",data:user});
            }
            else{
              res.status(200).send({message:"Invalid Password"})
            }
        });
    }
    else {
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