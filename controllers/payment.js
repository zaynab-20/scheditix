const paymentModel = require("../models/payment");
const ticketModel = require("../models/ticket");
const axios = require("axios");
const formattedData = new Date().toLocaleString()
const generator = require("otp-generator");
const ref = generator.generate(12, {
  upperCaseAlphabets: true,
  lowerCaseAlphabets: true,
  specialChars: false,
});
const korapaySecret = process.env.KORA_SECRET_KEY;

exports.initializePayment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { attendeeName, attendeeEmail} = req.body;
    const ticket = await ticketModel.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    if (ticket.soldTicket >= ticket.totalTicketNumber) {
      return res.status(400).json({
        message: "All ticket sold out",
      });
    }

    const paymentDetails = {
      customer: {
        name: attendeeName,
        email: attendeeEmail,
      },
      amount: ticket.ticketPrice,
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
      amount: ticket.ticketPrice,
      status: 'Pending',
      paymentDate:formattedData
    })

    await payment.save();
    res.status(200).json({message: 'Payment initialize Successful',
      data: {
        reference: data?.reference,
        checkout_url: data?.checkout_url
      }
    })

    // console.log(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error initializing payment",
    });
  }
};


exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query; 

    if (!reference) {
      return res.status(400).json({ message: "Reference is required" });
    }

    const response = await axios.get(
      "https://api.korapay.com/merchant/api/v1/transactions/${reference}",
      {
        headers: {
          Authorization:` Bearer ${korapaySecret}`
        }
      }
    );

    const { data } = response.data; 

    if (!data) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    
    const payment = await paymentModel.findOne({ reference });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found in the database" });
    }

    if (status === "success") {
      data.status = "Success";
      await payment.save();

      const ticket = await ticketModel.findById(payment.eventId);

      if (ticket) {
        ticket.soldTicket += 1;
        await ticket.save();
      }

      return res.status(200).json({
        message: "Payment verified successfully",
        data: payment
      });
    } else {
      data.status = "Failed";
      await payment.save();

      return res.status(400).json({
        message: "Payment verification failed",
        data: payment
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error verifying payment",
    });
  }
};