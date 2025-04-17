const mongoose = require('mongoose');


const ticketSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'events',
    required: true
  },
  attendeeId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
    required: true
  },
  attendeeName: {
    type: String,
    required: true
  },
  attendeeEmail: {
    type: String,
    required: true
  },
  TicketQuantity: {
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