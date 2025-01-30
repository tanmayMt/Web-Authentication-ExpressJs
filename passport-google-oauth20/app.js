require("./config/database");
require("dotenv").config();
const express = require("express");
const User = require("./models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// Import the passport module to handle authentication strategies
const passport = require("passport"); //https://www.passportjs.org/
// Import express-session to handle session management (tracking user's logged-in state)
const session = require("express-session");  //store session data   https://www.npmjs.com/package/express-session
const MongoStore = require("connect-mongo"); //'connect-mongo' used to store session data in a MongoDB database instead of the default memory store.
// EJS allows you to write dynamic HTML templates by embedding JavaScript code directly within the HTML.
// It is used to render HTML views for routes, like res.render("pageName"), where pageName corresponds to an .ejs file in the views directory.
// Why use it: EJS simplifies generating dynamic web pages with variables and logic directly in the templates, making it a popular choice for server-side rendering.
require("./config/passport"); // Import the passport configuration to set up authentication strategies and session handling
const ejs = require("ejs");
const app = express();


// Set EJS (Embedded JavaScript) as the template/view engine for rendering HTML pages
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use express-session to configure session handling
// Trust the first proxy, typically used when your app is behind a reverse proxy (like Nginx or Heroku)
app.set('trust proxy', 1);  // Ensures the app correctly handles proxy settings and trusts the first proxy.
// Set up session management middleware
app.use(session({
  secret: 'keyboard cat',  // Secret key used to sign the session ID cookie to ensure the integrity of the session.
  resave: false,           // Prevents the session from being saved back to the store if it hasn't been modified.
  saveUninitialized: true, // Forces the session to be saved even if it hasn't been modified (e.g., for new sessions).
  
  // Compatible Session Stores
  //connect-mongo A MongoDB-based session store.  https://www.npmjs.com/package/connect-mongo
  store: MongoStore.create({ //This method initializes and creates a session store backed by MongoDB
    mongoUrl: process.env.MONGO_URL,   // The MongoDB connection string stored in environment variables for security.
    collectionName: "sessions",        // The name of the collection where session data will be stored in MongoDB.
   })
  // Uncomment the following line if using HTTPS and want to ensure the cookie is only sent over secure connections.
  // cookie: { secure: true } // Ensure cookies are only sent over HTTPS (useful for production).
}));

// Initialize Passport for handling authentication
app.use(passport.initialize());  // Initializes Passport, allowing it to process authentication requests
// Enable session support in Passport
app.use(passport.session());  // Configures Passport to store user information in the session

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
        res.redirect(`/login?username=${encodeURIComponent(username)}`);
        // res.redirect("/login");
        // res.status(201).send({success:true,message:"Registeration Successfull",data:newUser});
    })
  }
  catch(error){
    res.status(500).send(error.message);
  }
})

// Middleware to check if the user is already logged in
const checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");// Redirects logged-in users to the profile page
  }
  next();// Proceeds to the next middleware or route handler if not logged in
};

// Route to display the login page if the user is not already logged in
app.get("/login",checkLoggedIn,(req,res)=>{
  // res.render("login");
  res.render("login", { username: req.query.username || "" });
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

// login : post
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: "/profile",
   }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// Middleware to check if the user is authenticated
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {  // Checks if the user is authenticated using Passport.js
    return next(); // If authenticated, proceed to the next middleware or route handler
  }
  res.redirect("/login"); // If not authenticated, redirect the user to the login page
};

// Route to render the profile page
app.get("/profile", checkAuthenticated, (req, res) => {
  res.render("profile",{username:req.user.username}); // Renders the "profile" view if the user is authenticated
                     // Passes the authenticated user's username to the "profile" view
});


// Route to handle user logout
app.get("/logout", (req, res) => {
  try {
    // Logs out the user and removes the session
    req.logout((err) => {
      if (err) {
        return next(err); // Passes the error to the next middleware
        //In Express.js, next is a function that passes control to the next middleware function in the request-response cycle.
        //If an error occurs inside a middleware function, calling next(err) will forward the error to Express's built-in error-handling middleware.
      }
      res.redirect("/"); // Redirects to the home page after logout
    });
  } catch (error) {
    res.status(500).send(error.message); // Sends a 500 error response if something goes wrong
  }
});

module.exports = app;