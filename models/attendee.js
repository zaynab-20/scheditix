const mongoose = require('mongoose');
const attendeeSchema = new mongoose.Schema({
      eventId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'events'
      },
        ticketNumber:{
        type:String,
        required:true
    },
    packingSpace:{
        type:String,
        enum:['yes','no']
    },
    checkInCode: {
        type: String,
        unique: true, 
        required: true,  
      }

},{timestamps: true})
const attendeeModel = mongoose.model('attendee',attendeeSchema)
module.exports = attendeeModel