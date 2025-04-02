const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'events'
  },
  eventTitle: {
    type: String,
    ref: 'events'
  },
  attendeeEmail: {
    type: String,
    require: true
  },
  attendeeName: {
    type: String,
    require: true
  },
  reference: {
    type: String,
    require: true
  },
  amount: {
    type: Number,
    require: true
  },
  status: {
    type:String,
    enum: ['Pending','Successful','Failed'],
    default: 'Pending'
  },
  paymentDate: {
    type:String,
    require:true
  }
}, {timestamps: true});

const paymentModel = mongoose.model('payments', paymentSchema);

module.exports = paymentModel;