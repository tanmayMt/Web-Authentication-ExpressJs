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
        const newUser = new User(req.body);
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