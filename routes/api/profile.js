// FOR = anything tı do with profiles.Adding,fetching,updating them etc.
const express = require("express");
let router = express.Router();

//@route   GET(type) api/profile(endpoint)
//@desc    Test route(what this route does)
//@access  Public(public or private)
router.get("/", (req, res) => {
  res.send("Profile route");
});

module.exports = router;
