// FOR = anything tı do with profiles.Adding,fetching,updating them etc.
const express = require("express");
let router = express.Router();
const auth = require("../../middleware/auth");
//If we want to protect the route we just get it and add it as a second parameter

const { check, validationResult } = require("express-validator");
const config = require("config");
const axios = require("axios");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

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
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    //user is where we want to populate from,name and avatar are
    //fields which does not contained by Profile model they belong to user
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

//@route   POST api/profile
//@desc    Create or update user profile
//@access  Private

//We want 2 middleware
/*auth needed because if there is no user they cant have a profile
therefore they can't access post route.Check is self exp.*/
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills are required").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //When sending "status" dont "res.send" it.Instead "res.status" it
      res.status(400).json({ errors: errors.array() });
    }
    //We want to pull all the fields out.
    //We paste this in because we are doing d-structuring but there are alotof fields
    const {
      //we are pulling all this from req.body
      //We need some fields added before submitting the database
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    //Build profile object
    const profileFields = {};
    //In models/Profile there is a user field and we will get it from req.user.id
    //We know that from token was sent
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status; //Either way we check status if no they will
    //get error,if there is this will set it
    if (githubusername) profileFields.githubusername = githubusername;
    //ctrl+shift up or down put curser
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    //First we did this wrong just sent "skills" that sent in the body at the postman
    //We need splitted and trimmed skills
    //console.log(profileFields.skills);

    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id }); //req.user.id is jwt object _id

      //If we found a profile and we want to update it
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          //find the user
          { user: req.user.id },
          //what to update
          { $set: profileFields },
          //You should set the new option to true to return the document after update was applied.
          //mongoose findoneandupdate returns the document itself
          //mongo driver returns result object
          { new: true }
        );

        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

//@route   Get api/profile
//@desc    Get all profiles
//@access  Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route   Get api/profile/user/:user_id
//@desc    Get profile by user ID not profile id
//@access  Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    //Check if there is profile
    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
      //People may enter valid userid but not registered
      //If type 1 less or more character it will send
      //server error we change that so always show
      //profile not found message
    }
    res.status(500).send("Server error");
  }
});

//@route   DELETE api/profile
//@desc    DELETE profile,user&posts
//@access  Private

router.delete("/", auth, async (req, res) => {
  try {
    //Remove user posts
    await Post.deleteMany({ user: req.user.id });

    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route   Put api/profile/experience
//@desc    Add profile experience
//@access  Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title, //title: title is same as just title
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      //we need the profile first to add experience to.
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp); //same as push except it pushes it onto the beginning
      //rather than the end.
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route   DELETE api/profile/experience/:exp_id
//@desc    Delete experience from profile
//@access  Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    //we map it because it is an array and may have several items in it

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route   Put api/profile/education
//@desc    Add profile education
//@access  Private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "Schoole is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      //we need the profile first to add experience to.
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu); //same as push except it pushes it onto the beginning
      //rather than the end.
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route   DELETE api/profile/education/:edu_id
//@desc    Delete education from profile
//@access  Private

//education ctrl+d repeat for selection
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    //we map it because it is an array and may have several items in it

    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route   Get api/profile/github/:username
//@desc    Get user repos from Github
//@access  Public

router.get("/github/:username", async (req, res) => {
  try {
    const uri = encodeURI(
      //5 repo per page and ascended order(recent to old)
      //it will give 5 repos in the json format if you want more change the number
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      "user-agent": "node.js",
      Authorization: `token ${config.get("githubToken")}`,
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
    //if you dont put return it will give an error "headers already sent"
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server errors");
  }
});

module.exports = router;
