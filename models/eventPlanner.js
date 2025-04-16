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
  },
  plan:{
    type:String,
    enum: ['Basic','Pro','Premium'],
    default:'Basic'
  },
  userTickets:{
    type:Number,
    default:0
  },
  profilePic:{
    imageUrl:{
      type:String,
      require:true
    },
    publicId:{
      type:String,
      require:true
    }
  }
},{timestamps: true})

const eventPlannerModel = mongoose.model("eventPlanners", eventPlannerSchema)

module.exports = eventPlannerModel
