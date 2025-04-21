const mongoose = require('mongoose');
const attendeeSchema = new mongoose.Schema({
      eventId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'events',
        require:true
      },
    checkInCode: {
        type: String,
        unique: true, 
        require: true,  
      }

},{timestamps: true})
const attendeeModel = mongoose.model('attendee',attendeeSchema)
module.exports = attendeeModel