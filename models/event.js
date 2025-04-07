const { string } = require('joi');
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
    type: String, 
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
  category: [{ 
    type: mongoose.SchemaTypes.ObjectId, 
    ref: 'category' 
}],
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
createdBy:{
  eventPlannerId: {
    type:mongoose.SchemaTypes.ObjectId,
    ref: 'eventPlanner',
    required:true
  },
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