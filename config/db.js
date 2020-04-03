//created for mongoDB connection to not crowd the server.js
const mongoose = require("mongoose");
//config dep. for global values and needed to get them
const config = require("config");
//get variable from default.json
const db = config.get("mongoURI");

//wait until connected to database
const connectDB = async () => {
  //need to be in try catch because we need to know why the connection fail
  //or what is the problem
  try {
    //if didn't use "async" then have to use ".then().catch()" which will be dirty
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.log(err.messsage);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
