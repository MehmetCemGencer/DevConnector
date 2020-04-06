// FOR = form area like,comment etc.
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route   POST api/posts
//@desc    Create a post
//@access  Private
router.post(
  "/",
  [auth, [check("text", "Text is required").notEmpty()]],
  //FUCKING IDIOT DONT FORGET TO PUT "()" BECAUSE
  //VSCODE DOES NOT PUT IT
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //We will find user by id
      const user = await User.findById(req.user.id).select("-password");

      //This should be a new Post object in order to save it
      //if it is not you will get an error
      const newPost = new Post({
        text: req.body.text,
        //this is the founded users name and avatar
        name: user.name,
        avatar: user.avatar,
        //this will get with the jwt
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route   GET api/posts
//@desc    Get all post
//@access  Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route   GET api/posts/:id
//@desc    Get single post by post id
//@access  Private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    //If id that passed is not a valid object id
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

//@route   DELETE api/posts/:id
//@desc    Delete a post
//@access  Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    //Post wanted to be deleted need to be own by the same user
    //Check user
    //post.user is object id so we have to convert it to string
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

//@route   PUT api/posts/like/:id
//@desc    Like a post
//@access  Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //Check if the post has already been liked by same user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      //Because this is a filter function it will return an array and
      //if user already liked it it will return an array with 1
      //if user did not liked it it wont return anything
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();

    //We will see in the front end why he returned post.likes
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route   PUT api/posts/unlike/:id
//@desc    Unlike a post
//@access  Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //Check if the post has already been liked by same user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      //Because this is a filter function it will return an array and
      //if user already liked it it will return an array with 1
      //if user did not liked it it wont return 0
      //and if not liked you cant unlike it
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    //Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString()) //it will return objectId that why toString
      .indexOf(req.user.id);
    //this will get the correct like to remove

    //take out of array
    post.likes.splice(removeIndex, 1);
    await post.save();

    //We will see in the front end why he returned post.likes
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route   POST api/posts/comment/:id id of the post
//@desc    Comment on a post
//@access  Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //We will find user by id
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id); //This will give us post

      //comments are not actual collections in the database
      //remove the new thing(this section copied from api/posts post)
      const newComment = {
        text: req.body.text,
        //this is the founded users name and avatar
        name: user.name,
        avatar: user.avatar,
        //this will get with the jwt
        user: req.user.id,
      };

      //Add new comment to the post's(post'un) comments
      post.comments.unshift(newComment); //add it to the beginning
      await post.save(); //post needed to be created already
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route   DELETE api/posts/comment/:id/:comment_id
//we need id of the post and id of the comment
//@desc    Delete comment
//@access  Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //This will give us post

    //Pull out comment
    const comment = post.comments.find(
      //it takes a function like foreach map filter
      (comment) => comment.id === req.params.comment_id
    ); //post model has "comments" section
    //this will give us either comment or false

    //Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exists" });
    }

    //Check if the user is actually the one who made the comment
    if (comment.user.toString() !== req.user.id) {
      //comment.user will return objectID need to convert it
      return res.status(401).json({ msg: "User not authorized" });
    }

    //copied from unlike
    //Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString()) //it will return objectId that why toString
      .indexOf(req.user.id);
    //this will get the correct comment to remove

    //take out of array
    post.comments.splice(removeIndex, 1);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
