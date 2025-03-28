const mongoose = require ('mongoose');
const userSchema = mongoose.Schema({

    userName: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    phoneNo: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerried: {
        type: Boolean,
        default: false
    },
    isloggedIn: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const userModel = mongoose.model("Users", userSchema)

module.exports = userModel
