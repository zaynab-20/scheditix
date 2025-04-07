const mongoose = require ('mongoose');
const eventPlannerSchema = mongoose.Schema({
  fullname: {
   type: String,
   required: true,
   trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phoneNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
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

const eventPlannerModel = mongoose.model("eventPlanners", eventPlannerSchema)

module.exports = eventPlannerModel
