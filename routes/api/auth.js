// FOR = getting jwt for authentication
const express = require("express");
let router = express.Router();
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

//@route   GET(type) api/auth(endpoint)
//@desc    Get user by token(what this route does)
//@access  Private(public or private)
router.get("/", auth, async (req, res) => {
  //doing async because we make a call to database
  try {
    //we set user in middleware/auth.js "req.user=decode.user"
    const user = await User.findById(req.user.id).select("-password"); //dont want pass
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  POST api/auth
//@desc   Authenticate user & get token
//@access Public
router.post(
  "/",
  [
    //Because it is login we don't need name
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(), //we want to know it exist not it length
  ],
  async (req, res) => {
    //validation result is express validator object
    //it will return errors if there is any input errors
    const errors = validationResult(req);
    //if there are errors
    if (!errors.isEmpty()) {
      //if there is errors we want to send 400(bad request)
      //and json with errors in it
      //we will get "errors":[] because we define it
      return res.status(400).json({ errors: errors.array() });
    }

    //I think this will be in the react part that we need to type in
    //and it will be in the body of the page
    const { email, password } = req.body;
    try {
      //See if user exists
      let user = await User.findOne({
        email /*This is the same as in the email 3 lines up there*/,
      });
      if (!user) {
        //To match same error type as up there on the client side
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
        //useCreateIndex:true mongoose error
      }

      //Plain text password users entered(password)
      //Hashed password from db (user.password) we make a req to db to get the user
      //1 line before the try method.If user not exists it wil already throw an error
      //in the if statement above
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      } //Better to type invalid credentials because if wrong password
      //people keep trying password but figureout that email in the database
      //Return jsonwebtoken
      //payload is the part in jwt ,data you want to send within token
      const payload = {
        user: {
          //Because we save it now user has an id property in the mongodb
          //object have _id property.Normally we do in mongo user._id
          //mongoose use abstraction so we dont have to use "._id"
          id: user.id,
        },
      };
      //creates a token
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        //in production we make it 3600(1hour) but in dev dont want to
        //expire quickly
        { expiresIn: 360000 },
        //if possible throw error first like connection and stuff
        (err, token) => {
          if (err) throw err;
          //sending user.id not necessary the way we build this
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
