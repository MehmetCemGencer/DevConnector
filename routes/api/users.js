// FOR = registering,adding users
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
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
    const { name, email, password } = req.body;
    try {
      //See if user exists
      let user = await User.findOne({
        email /*This is the same as in the email 3 lines up there*/
      });
      if (user) {
        //To match same error type as up there on the client side
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
      //user.save() needed to be saved in the database
      user = new User({
        //these are from req.body name,etc.
        name,
        email,
        avatar,
        password
      });

      //Encrypt password(bcrypt)
      //10 is rounds
      const salt = await bcrypt.genSalt(10);
      //will get promise crypt the password and then save it
      //wait till get password hash it --hash(what to hash should be plain text password,with what)
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Return jsonwebtoken
      //payload is the part in jwt ,data you want to send within token
      const payload = {
        user: {
          //Because we save it now user has an id property in the mongodb
          //object have _id property.Normally we do in mongo user._id
          //mongoose use abstraction so we dont have to use "._id"
          id: user.id
        }
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
