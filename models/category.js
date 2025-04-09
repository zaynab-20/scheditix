const mongoose = require('mongoose')
const eventCategorySchema = new mongoose.Schema({
    categoryName:{
      type:String,
      enum:['wedding','techEvent','birthdayParty','namingCeremony','comedy','getTogether']
    },
    // createdBy: {
    //     eventPlannerId: { 
    //     type: mongoose.SchemaTypes.ObjectId, 
    //     ref: 'eventPlanner', 
    //     required: true 
    //   }
    // }
},{ timestamps: true });

const categoryModel = mongoose.model('EventCategories',eventCategorySchema)

module.exports = categoryModel