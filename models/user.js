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
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: { 
    type: String,
    enum: ['Admin', 'Organizer', 'Attendee'],
    default: 'Attendee'
  },
  isAdmin: {
   type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  }
}, {timestamps: true})

const userModel = mongoose.model("Users", userSchema)

module.exports = userModel
