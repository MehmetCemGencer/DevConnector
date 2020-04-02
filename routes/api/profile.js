// FOR = anything tı do with profiles.Adding,fetching,updating them etc.
const express = require("express");
let router = express.Router();
const auth = require("../../middleware/auth");
//If we want to protect the route we just get it and add it as a second parameter

const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route   GET(type) api/profile/me(endpoint)
//@desc    Get current users profile
//@access  Private
//we will use mongoose so it will be async
// /me is the end point
router.get("/me", auth, async (req, res) => {
  try {
    /*
    We can access req.user ---user is the profile models user field which has user models object id
    req.user.id comes with token and findOne
    */
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);
    //user is where we want to populate from,name and avatar are fields
    //we populate because profile is not from user model

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
