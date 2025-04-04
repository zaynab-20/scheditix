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

const swaggerJsdoc = require("swagger-jsdoc");
const swagger_UI = require("swagger-ui-express")

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BASE URL: https://scheditix.onrender.com/documentation',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
           bearerFormat: "JWT"
        }
      }
    }, 
    security: [{ BearerAuth: [] }]
  },
  apis: ["./routes/*.js"] // Ensure this points to the correct path
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/documentation", swagger_UI.serve, swagger_UI.setup(openapiSpecification))

app.listen(PORT,() => {
  console.log(`My Server is Currently Running On Port ${PORT}`)
})