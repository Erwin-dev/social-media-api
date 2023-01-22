const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');


//Register
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        const user = await newUser.save();
        const { password, ...others } = user._doc;
        res.status(200).json({
            'message': 'Account created successfully',
            'user': others
        });
    } catch (error) {
        res.status(500).json(error)
    }
})

//Login 
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            res.status(404).json("User not exists");
            return;
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            res.status(422).json("Wrong password")
            return
        }

        const { password, ...others } = user._doc;
        res.status(200).json({
            'message': 'Logged in successfully',
            'user': others
        });
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;