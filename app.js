// 2: Database Encryption
// https://cryptii.com/
// - read mongoose encryption documentation: https://www.npmjs.com/package/mongoose-encryption
// - install mongoose encryption `npm install mongoose-encryption`
// - create new mongoose Schema

  // ```js
  // const mongoose = require("mongoose");
  // const encrypt = require("mongoose-encryption");

  // const userSchema = new mongoose.Schema({
  //   name: String,
  //   age: Number,
  //   // whatever else
  // });
  // ```

// - create an encryption key inside .env file

//   ```js
//   ENCRYPTION_KEY = thisismyencryptionkey;
//   ```

// - set encryption key with our schema

//   ```js
//   const encrypt = require("mongoose-encryption");

//   const encKey = process.env.ENCRYPTION_KEY;
//   // encrypt password regardless of any other options. name and _id will be left unencrypted
//   userSchema.plugin(encrypt, {
//     secret: encKey,
//     encryptedFields: ["password"],
//   });

//   User = mongoose.model("User", userSchema);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
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
        const newUser =  User(req.body);
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
    const { email, password } = req.body; // Extract email and password from the request body

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