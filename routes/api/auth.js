// FOR = getting jwt for authentication
const express = require("express");
let router = express.Router();

//@route   GET(type) api/auth(endpoint)
//@desc    Test route(what this route does)
//@access  Public(public or private)
router.get("/", (req, res) => {
  res.send("Auth route");
});

module.exports = router;
