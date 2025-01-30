// const mongoose = require("mongoose");
// const userSchema = mongoose.Schema({
//   username: {
//     type: String,
//     require: true,
//     unique: true,
//   },
//   googleId:{
//     type: String,
//     require:true,
//   }
//   // password: {
//   //   type: String,
//   //   require: true,
//   // },
// });

// const User = mongoose.model("User", userSchema);
// module.exports = User;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: String,
  username: String,
  email: String,
});

// Prevent overwriting the model if it's already registered
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;