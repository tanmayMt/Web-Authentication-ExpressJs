// https://www.passportjs.org/packages/passport-local/
// Passport strategy for authenticating with a username and password.
// This module lets you authenticate using a username and password in your Node.js applications. By plugging into Passport, local authentication can be easily and unobtrusively integrated into any application or framework that supports Connect-style middleware, including Express.

const passport = require("passport");      // For Passport.js functionality
const LocalStrategy = require("passport-local").Strategy; // For the LocalStrategy, used for username/password authentication
const User = require("../models/user.model"); // Import your User model, to interact with the user data in your database
const bcrypt = require("bcrypt");

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));

//When we will call routes this passport.use() will called. Login
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find the user by username in the database
      const user = await User.findOne({ username: username });
      // If no user is found, return an error with a message
      if (!user) {
        return done(null, false, { message: "Incorrect Username (config\\passport.js passport.use(new LocalStrategy()))" });
        //If authentication fails, done is called with null for the user, false to indicate failure, and an optional message.
      }
      // Compare the provided password with the stored hashed password
      // Corrected: Await bcrypt.compare to ensure it's properly handled
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password (config\\passport.js passport.use(new LocalStrategy()))" });
        //If authentication fails, done is called with null for the user, false to indicate failure, and an optional message.
      }
      // If the password matches, return the user object
      return done(null, user);
      //If authentication is successful, done is called with the user object to continue the authentication process.
    } catch (error) {
      // Handle any errors and pass them to the next middleware
      return done(error);
    }
  })
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
