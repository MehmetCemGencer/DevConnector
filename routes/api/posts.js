// FOR = form area like,comment etc.
const express = require("express");
let router = express.Router();

//@route   GET(type) api/posts(endpoint)
//@desc    Test route(what this route does)
//@access  Public(public or private)
router.get("/", (req, res) => {
  res.send("Posts route");
});

module.exports = router;
