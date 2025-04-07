const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
    category:{
        type:string,
        enum:['wedding','techEvent','birthdayParty','namingCeremony','comedy','getTogether']
    },
    event: {
        type: mongoose.SchemaTypes.ObjectId, 
        ref: 'event',
        required: true
    },
    createdBy: {
        eventPlannerId: { 
            type: mongoose.SchemaTypes.ObjectId, ref: 'eventPlanner', 
            required: true 
        }
    }
},{ timestamps: true });

const categoryModel = mongoose.model('categories',categorySchema)

module.exports = categoryModel