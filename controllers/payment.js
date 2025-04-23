const paymentModel = require("../models/payment");
const ticketModel = require("../models/ticket");
const eventModel = require("../models/event")
const axios = require("axios");
const formattedData = new Date().toLocaleString()
const generator = require("otp-generator");
const { Successful, Failed} = require("../utils/html");
const { send_mail } = require("../middleware/nodemailer");
const ref = generator.generate(12, {
  upperCaseAlphabets: true,
  lowerCaseAlphabets: true,
  specialChars: false,
});
const korapaySecret = process.env.KORA_PAY_SECRET_KEY;
exports.initializePayment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await ticketModel.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    if (ticket.soldTicket >= ticket.totalQuantity) {
      return res.status(400).json({
        message: "All ticket sold out",
      });
    }

    const event = await eventModel.findById(ticket.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    const attendeeName = ticket.fullName;
    const attendeeEmail = ticket.email;

    const paymentDetails = {
      customer: {
        name: attendeeName,
        email: attendeeEmail,
      },
      amount: event.ticketPrice,
      currency: "NGN",
      reference: ref,
    };

    const response = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize',paymentDetails,{
      headers: {
        Authorization:` Bearer ${korapaySecret}`
      }
    });

    const {data} = response.data;

    const payment = new paymentModel({
      eventId: ticket.eventId,
      eventTitle: ticket.eventTitle,
      attendeeEmail,
      attendeeName,
      reference: ref,
      amount: event.ticketPrice,
      paymentDate:formattedData
    })

    await payment.save();
    res.status(200).json({message: 'Payment initialize Successful',
      data: {
        reference: data?.reference,
        checkout_url: data?.checkout_url
      }
    })

    console.log(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error initializing payment",error:error.message
    });
  }
};


exports.verifyPayment = async (req, res) => {
  try{
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ message: "Reference is required" });
    }
    
    const payment = await paymentModel.findOne({reference: reference});
    
    if (!payment) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    const event = await eventModel.findById(payment.eventId);
    const ticket = await ticketModel.findOne({eventId: payment.eventId})
    const response = await axios.get(
      `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${korapaySecret}`,
        },
      }
    );


    const { data } = response;
    // console.log(response)

    if (data.status && data.data.status === 'success') {
      let total = ticket.soldTicket;
      ticket.soldTicket = total += 1;
      await ticket.save();
      payment.status = 'Successful'
      await payment.save();
      const firstName = ticket.fullname;
      const checkInCode = ticket.checkInCode;
      const tableNumber = ticket.tableNumber;
      const seatNumber = ticket.seatNumber
        const mailOptions = {
          email: ticket.email,
          subject: "Payment Successful",
          html: Successful(firstName,checkInCode,tableNumber,seatNumber),
        };
            
        await send_mail(mailOptions);
        return res.status(200).json({ message: "Payment successful",data:payment});
    }else{
      let total = ticket.soldTicket;
      await ticket.save();
      payment.status = 'Failed'
      await payment.save();
      const firstName = ticket.fullname;
        const mailOptions = {
          email: ticket.email,
          subject: "Payment Failed",
          html: Failed(firstName),
        };
            
        await send_mail(mailOptions);
        return res.status(400).json({ message: "Payment not successful",data:payment });
    }
  }catch(error){
    console.log(error.message)
    res.status(500).json({message: 'Error Verifying Payment',error:error.message})
  }
};