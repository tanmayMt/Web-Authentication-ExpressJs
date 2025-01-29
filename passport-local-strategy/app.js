require("./config/database");
const express = require("express");
const User = require("./models/user.model")
const bcrypt = require("bcrypt");
const saltRounds = 10;
// EJS allows you to write dynamic HTML templates by embedding JavaScript code directly within the HTML.
// It is used to render HTML views for routes, like res.render("pageName"), where pageName corresponds to an .ejs file in the views directory.
// Why use it: EJS simplifies generating dynamic web pages with variables and logic directly in the templates, making it a popular choice for server-side rendering.
const ejs = require("ejs");
const app = express();
// Set EJS (Embedded JavaScript) as the template/view engine for rendering HTML pages
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// base url
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",async(req,res)=>{
    try{
        const username = req.body.username;
        const user = await User.findOne({ username: username });
        if(user){
            return res.status(400).send("User is Already Exists");
        }
        const password = req.body.password;
        bcrypt.hash(password,saltRounds,async (err, hash)=>{
            const newUser = new User({
            username:username,
            password:hash
        });
        newUser.save();
        res.status(201).send({success:true,message:"Registeration Successfull",data:newUser});
    })
  }
  catch(error){
    res.status(500).send(error.message);
  }
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/profile",(req,res)=>{
    res.render("profile");
})

module.exports = app;