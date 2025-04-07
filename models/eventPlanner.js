const mongoose = require ('mongoose');
const eventPlannerSchema = mongoose.Schema({
  fullname: {
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
