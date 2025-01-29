require("./config/database");
const express = require("express");

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

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/profile",(req,res)=>{
    res.render("profile");
})

module.exports = app;