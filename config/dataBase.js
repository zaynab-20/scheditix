const mongoose = require('mongoose')

const DB = process.env.MONGODB_URI
mongoose.connect().then(() => {
  console.log('Connection To Database Has Been Establish Successfully')
})
.catch((error) => {
  console.log('Error Connecting To Database' + error.message)
})