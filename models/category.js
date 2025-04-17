const mongoose = require('mongoose')
const eventCategorySchema = new mongoose.Schema({
    categoryName:{
      type:String,
      enum:['Wedding','Tech Event','Birthday Party','Naming Ceremony','Comedy','Get Together'],
      unique: true
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