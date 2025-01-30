// https://www.passportjs.org/packages/passport-local/
// Passport strategy for authenticating with a username and password.
// This module lets you authenticate using a username and password in your Node.js applications. By plugging into Passport, local authentication can be easily and unobtrusively integrated into any application or framework that supports Connect-style middleware, including Express.
require("dotenv").config();
const passport = require("passport");      // For Passport.js functionality
const LocalStrategy = require("passport-local").Strategy; // For the LocalStrategy, used for username/password authentication
const User = require("../models/user.model"); // Import your User model, to interact with the user data in your database

const bcrypt = require("bcrypt");

//https://www.passportjs.org/packages/passport-google-oauth20/
const GoogleStrategy = require('passport-google-oauth20').Strategy;

    // clientID: process.env.GOOGLE_CLIENT_ID,
    // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: "http://localhost:3005/auth/google/callback"


    //When a user try to Login come with google, Google will genarate a 'accessToken', using this 'accessToken' user will login successfully.
    //Using the accessToken we can find user's 'profile'. From this 'profile' we can create googleId, which store in User Model in Database 
    //When 'accessToken' is expriered, than'refreshToken' will work.

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          // Ensure profile.emails exists before accessing [0].value
          const email = profile.emails?.[0]?.value || "no-email@gmail.com"; 

          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: email, // Use a default if email is not provided
          });

          await user.save();
          return done(null, user);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);





//serializeUser and deserializeUser methods in the context of Passport.js
 // create session id
 // whenever we login it creares user id inside session
 // This function determines what data will be stored in the session when a user logs in.
// Serialize the user by saving their ID in the session
passport.serializeUser((user, done) => {
  // Store only the user ID in the session, which will be used to identify the user in subsequent requests
  done(null, user.id);
});

// find session info using session id
//This function retrieves the full user information from the database using the id stored in the session.
// Deserialize the user by finding them in the database using their session ID
passport.deserializeUser(async (id, done) => {
  try {
    // Find the user from the database using the id saved in the session
    const user = await User.findById(id);
    
    // If user is found, pass the user object to the done callback
    done(null, user);
  } catch (error) {
    // If there is an error, pass the error to the done callback
    done(error, false);
  }
});
