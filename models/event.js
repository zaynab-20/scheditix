const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  eventTitle: {
    type: String,
    require: true
  },
  eventDate: {
    type: Date,
    require:true
  },
  eventTime: {
    type: String,
    require:true
  },
  eventLocation: {
    type: String,
    require:true
  },
  eventAgenda: {
    type: String,
    require:true
  },
  eventDescription: {
    type: String,
    require:true
  },
  speakers: [{
    type: String,
    require:true
  }],
  eventCategory: {
    type: String, 
    require: true
  },
  image: [{
    imageUrl: {
      type: String,
      require: true
    },
    imagePublicId: {
      type: String,
      require: true
    }
  }],
  organizerId: {
    type:mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    require: true
  },
  totalTableNumber: {
    type: Number,
    require: true
  },
  totalSeatNumber: {
    type: Number,
    require: true
  },
  sharableLink: {
    type: String
  }
},{
  timestamps: true
});


const eventModel = mongoose.model('Events',eventSchema)

module.exports = eventModel