const mongoose = require('mongoose');


const ticketSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'events',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  numberOfTicket: {
    type: Number,
    required: true,
  },
  needCarPackingSpace: {
    type: String,
    enum: ["Yes", "No"],
    default: "No"
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
    type: Number
    // required: true
  },
  seatNumber: {
    type: Number
    // required: true
  },
  checkInCode: {
    type: String,
    unique: true, 
    required: true,  
  },
  checkedIn: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'No'  
  }
}, {timestamps: true});

const ticketModel = mongoose.model('tickets', ticketSchema);

module.exports = ticketModel;