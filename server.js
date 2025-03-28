require("./config/dataBase")
require("dotenv").config()
const express = require('express')

const cors = require('cors')
const PORT = process.env.PORT || 9898


const userRouter = require("./routes/userRouter")
const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/v1', userRouter)

app.listen(PORT,() => {
  console.log(`My Server is Currently Running On Port ${PORT}`)
})