const mongoose = require('mongoose')
const router = require('express').Router();

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true,
        max: 500
    },
    likes: {
        type: Array,
        default: []
    }

},
    { timestamps: true }
)

module.exports = mongoose.model("Post", PostSchema);
