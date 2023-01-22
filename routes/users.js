const router = require('express').Router();
const Post = require("../models/Post")
const User = require("../models/User");
const { post } = require('./auth');


//Follow
router.get("/:id/follow", async (req, res) => {
    if (req.body.userId != req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("User has been followed");
                return
            } else {
                res.status(200).json("You already followed this user");
                return
            }
        } catch (error) {
            res.status(500).json(error)
        }

    } else {
        res.status(403).json("You can not follow yourself")
    }
})

//Unfollow
router.get("/:id/unfollow", async (req, res) => {
    if (req.body.userId != req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("User has been unfollowed");
                return
            } else {
                res.status(200).json("You do not follow this user");
                return
            }
        } catch (error) {
            res.status(500).json(error)
        }

    } else {
        res.status(403).json("You can not follow yourself")
    }
})

//Get user friends
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(user.followings.map((friend_id) => {
            return User.findById(friend_id);
        }));
        let friendList = [];
        friends.map((friend) => {
            const { _id, username } = friend;
            friendList.push({ _id, username })
        })
        res.status(200).json(friendList)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;