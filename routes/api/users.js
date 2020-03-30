// FOR = registering,adding users
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
//When creating router we dont use "app" instead we use router

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
    check("name", "Name is required!")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  (req, res) => {
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
    res.send("users route");
  }
);

module.exports = router;
