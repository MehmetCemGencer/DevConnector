// FOR = getting jwt for authentication
const express = require("express");
let router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/User");
//@route   GET(type) api/auth(endpoint)
//@desc    Test route(what this route does)
//@access  Public(public or private)
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

module.exports = router;
