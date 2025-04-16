const mongoose = require('mongoose');


const ticketSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'events'
  },
  totalTicketNumber: {
    type: Number,
    require: true
  },
  soldTicket: {
    type: Number,
    default: 0
  },
  ticketPrice: {
    type: Number,
    require: true
  },
  tableNumber: {
    type: Number,
    required: true
  },
  seatNumber: {
    type: Number,
    required: true
  },
  checkInCode: {
    type: String,
    unique: true, 
    required: true,  
  }
}, {timestamps: true});

const ticketModel = mongoose.model('tickets', ticketSchema);

module.exports = ticketModel;