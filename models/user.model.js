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

const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const encKey = process.env.ENC_KEY;
userSchema.plugin(encrypt, {
  secret: encKey,
  // signingKey: sigKey,
  encryptedFields: ["password"],
});

module.exports = mongoose.model("user", userSchema);
