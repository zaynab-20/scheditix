const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    require:true
  },
  time: {
    type: String,
    require:true
  },
  location: {
    type: String,
    require:true
  },
  agenda: {
    type: String,
    require:true
  },
  description: {
    type: String,
    require:true
  },
  speakers: [{
    type: String,
    require:true
  }],
  eventType: {
    type: String, 
    require: true
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
  organizerId: {
    type:mongoose.SchemaTypes.ObjectId,
    ref: 'User',
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