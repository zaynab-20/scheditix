const mongoose = require('mongoose');
const attendeeSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
        ticketNumber:{
        type:String,
        required:true
    }

},{timestamps: true})
const attendeeModel = mongoose.model('ettendee',attendeeSchema)
module.exports = attendeeModel