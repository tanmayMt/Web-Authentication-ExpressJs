//when user sent a requtest from forntend to the server with token, than server will cheack or authenticate the validation of this token
//To authenticate this token we will use password-jwt https://www.passportjs.org/packages/passport-jwt/
// we will do that authentication part at config/passport.js file

// require("dotenv").config();
// const User = require("../models/user.model");

// const passport = require("passport");
// const JwtStrategy = require('passport-jwt').Strategy,
//     ExtractJwt = require('passport-jwt').ExtractJwt;            //token: "Bearer " + token,   to extract this "Bearer "  ExtractJwt is used
// var opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = process.env.SECRET_KEY;

// passport.use(new JwtStrategy(opts, function(jwt_payload, done) {  // user information are store here in jwt_payload
//     User.findOne({id: jwt_payload.id}, function(err, user) {
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//             // or you could create a new account
//         }
//     });
// }));


require("dotenv").config();
const User = require("../models/user.model");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt; 

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Extracts "Bearer <token>"
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => { // Converted to async function
    try {
      // Use async/await instead of callback
      const user = await User.findOne({ _id: jwt_payload.id }); // Use _id instead of id
      
      if (user) {
        return done(null, user); // User found
      } else {
        return done(null, false); // User not found
      }
    } catch (err) {
      return done(err, false); // Handle errors
    }
  })
);
