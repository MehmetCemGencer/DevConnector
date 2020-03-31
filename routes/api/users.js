// FOR = registering,adding users
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
//When creating router we dont use "app" instead we use router

//Get the user model
const User = require("../../models/User");
//@route   POST(type) api/users(endpoint)
//@desc    Register users
//@access  Public(public or private)
router.post(
  "/",
  [
    //this Check is express-validator function to check
    //.not().isEmpty() is equal to notEmpty()
    //negates the result of the next validator
    //check('weekday').not().isIn(['sunday', 'saturday'])
    //These are input errors
    check("name", "Name is required!")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  //DevConnector Notes 3-62
  async (req, res) => {
    //validation result is express validator object
    //it will return errors if there is any
    const errors = validationResult(req);
    //if there are errors
    if (!errors.isEmpty()) {
      //if there is errors we want to send 400(bad request)
      //and json with errors in it
      //we will get "errors":[] because we define it
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      //See if user exists
      let user = await User.findOne({
        email /*This is the same as in the email 3 lines up there*/
      });
      if (user) {
        //To match same error type as up there
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
        //useCreateIndex:true mongoose error
      }

      //Get users gravatar
      const avatar = gravatar.url(email, {
        //size
        s: "200",
        //rating is pg
        r: "pg",
        //default doesn't remember what it is 404 give error
        //mm at least will give empty head
        d: "mm"
      });

      //if user doesn't exists we create it using User.js
      //This creates it doesn't save it.Before saving it have to encrypt the pass
      user = new User({
        //these are from req.body name,etc.
        name,
        email,
        avatar,
        password
      });

      //Encrypt password(bcrypt)
      const salt = await bcrypt.genSalt(10);
      //10 is rounds
      //will get promise crypt the password and then save it
      //wait till get password hash it --hash(what to hash should be plain text password,with what)
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      //Return jsonwebtoken
      res.send("user registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
