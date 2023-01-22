const mongoose = require('mongoose') 
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3, 
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 30, 
        min: 5,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 7, 
    },
    addres: {
        type: String,
        required: false, 
        min: 5,
        default: ""
    },
    dateOfBirth: {
        type: Date, 
        default: ""
    },
    followers: {
        type: Array,
        default: []
    }, 
    followings: {
        type: Array,
        default: []
    }, 
    isAdmin: {
        type: Boolean,
        default: false
    }, 
    desc: {
        type: String, 
        max: 200
    }
},

    {timestamps: true}, 

)

module.exports = mongoose.model("User", UserSchema);