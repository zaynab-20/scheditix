require("./config/dataBase")
require("dotenv").config()
const express = require('express')

const cors = require('cors')
const PORT = process.env.PORT || 9898


const userRouter = require("./routes/userRouter");
const eventRouter = require("./routes/eventRouter");
const ticketRouter = require("./routes/ticket")
const paymentRouter = require("./routes/payment")
const app = express();

app.use(express.json())
app.use(cors())

app.use('/api/v1', userRouter);
app.use('/api/v1',eventRouter);
app.use('/api/v1',ticketRouter);
app.use('/api/v1',paymentRouter);

app.use((error, req, res, next) => {
  if(error){
     return res.status(400).json({message:  error.message})
  }
  next()
})

app.listen(PORT,() => {
  console.log(`My Server is Currently Running On Port ${PORT}`)
})