// FOR = registering,adding users
const express = require("express");
let router = express.Router();
//When creating router we dont use "app" instead we use router

//@route   GET(type) api/users(endpoint)
//@desc    Test route(what this route does)
//@access  Public(public or private)
router.get("/", (req, res) => res.send("users route"));

module.exports = router;
