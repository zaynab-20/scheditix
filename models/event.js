const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  eventTitle: {
    type: String,
    require: true
  },
  eventDescription: {
    type: String,
    require:true
  },
  eventCategory: { 
    type: mongoose.SchemaTypes.ObjectId, 
    ref: 'EventCategories',
    require: true 
  },
  eventLocation: {
    type: String,
    require:true
  },
  startDate: {
    type: String,
    require:true
  },
  endDate: {
    type: String,
    require:true
  },
  startTime: {
    type: String,
    require:true
  },
  endTime: {
    type: String,
    require:true
  },
  eventAgenda: {
    type: String,
    require:true
  },
  eventRule: {
    type: String,
    require:true
  },
  image: {
    imageUrl: {
      type: String,
      require: true
    },
    imagePublicId: {
      type: String,
      require: true
    }
  },
  eventPlannerId: {
    type:mongoose.SchemaTypes.ObjectId,
    ref: 'eventPlanners',
    require:true
  },

  totalTableNumber: {
    type: Number,
    require: true
  },
  totalSeatNumber: {
    type: Number,
    require: true
  },
  ticketSold: { 
    type: Number, 
    default: 0 
  },
  totalAttendee: { 
    type: Number, 
    default: 0 
  },
  revenueGenerated: { 
    type: Number, 
    default: 0 
  },
  noOfCheckings: { 
    type: Number, 
    default: 0 
  },
  status: { 
    type: String, 
    enum: ['upcoming', 'ongoing', 'completed'], 
    default: 'upcoming' 
  },
  featured: {
    type: Boolean,
    default: false
  },
  ticketPrice: {
    type: Number,
    required: true
  },
  tableNumber: {
    type: Number,
    default: 1
  },
  seatNumber: {
    type: Number,
    default: 0
  },
  seatPerTable: {
    type: Number
  },
  ticketQuantity: {
    type: Number,
    required: true,
    default: 0 
  },
  ticketPurchaseLimit: {
    type: Number,
    default: 3
  },
  parkingAccess: {
    type: String,
    enum: ["yes", "no"],
    default: "no"
  }
},{
  timestamps: true
});


const eventModel = mongoose.model('Events',eventSchema)

module.exports = eventModel