const router = require('express').Router();
const Post = require("../models/Post")
const User = require("../models/User");
const { post } = require('./auth');

//Create new Post
router.post("/", async(req, res) => {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json({
            "message": "Post vreated successfully",
            "data": savedPost
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

//Update post
router.put("/:id", async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body }, {new: true});
            res.status(200).json({
                "message": "Post has been updated",
                "data": post
            });
            return
        } else {
            res.status(403).json("This is not your post");
            return
        }
    } catch(err) {
        res.status(500).json(err)
    }
})

//Update post
router.delete("/:id", async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.deleteOne({ $set: req.body });
            res.status(200).json("Post has been deleted");
            return
        } else {
            res.status(403).json("This is not your post");
            return
        }
    } catch(err) {
        res.status(500).json(err)
    }
})

//get All Posts
router.get("/", async(req, res) => {
    try{
        const posts = await Post.find();
        res.status(200).json(posts) 
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/:id/like", async(req,res) => {
    try {
        const posts = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: {likes: req.body.userId} });
            res.status(200).json("the post has beed liked");
            return
        } else {
            await post.updateOne({ $pull: {likes: req.body.userId} });
            res.status(200).json("the post has beed disliked");
            return
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//get post by id
router.get("/:id", async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post) 
    } catch (error) {
        res.status(500).json(error)
    }
})

//get timeline
router.get("/timeline/:userId", async(req, res) => {
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({userId: friendId});
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts)) 
    } catch (error) {
        res.status(500).json(error)
    }
})

//get user posts
router.get("/profile/:username", async(req, res) => {
    try{
        const user = await User.findOne({username: req.params.username});
        const posts = await Post.fins({userId: user._id});
        res.status(200).json(post) 
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;