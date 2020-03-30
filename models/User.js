const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    //This will give current date and time to user regis.
    default: Date.now
  }
});
//"User" is a variable for using model
//"user" in the model is the model name and collection will derived from that name
module.exports = User = mongoose.model("user", UserSchema);
