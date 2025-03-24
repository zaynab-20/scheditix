const express = require('express')
const PORT = process.env.PORT || 9898
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())


app.listen(PORT,() => {
  console.log(`My Server is Currently Running On Port ${PORT}`)
})