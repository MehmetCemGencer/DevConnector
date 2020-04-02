// FOR = anything tı do with profiles.Adding,fetching,updating them etc.
const express = require("express");
let router = express.Router();
const auth = require("../../middleware/auth");
//If we want to protect the route we just get it and add it as a second parameter

//@route   GET(type) api/profile/me(endpoint)
//@desc    Get current users profile
//@access  Private
router.get("/", auth, (req, res) => {
  res.send("Profile route");
});

module.exports = router;
