const paymentModel = require("../models/payment");
const ticketModel = require("../models/ticket");
const eventModel = require("../models/event")
const axios = require("axios");
const formattedData = new Date().toLocaleString()
const generator = require("otp-generator");
const { successfulPaymentTemplate, failedPaymentTemplate } = require("../utils/html");
const { send_mail } = require("../middleware/nodemailer");

const korapaySecret = process.env.KORA_PAY_SECRET_KEY;
exports.initializePayment = async (req, res) => {
  try {
    const ref = generator.generate(12, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: false,
    });
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
      amount: event.ticketPrice * ticket.numberOfTicket,
      currency: "NGN",
      reference: ref,
      redirect_url: `https://schedi-tix-front-end.vercel.app/payment-verify`
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
      amount: event.ticketPrice * ticket.numberOfTicket,
      paymentDate:formattedData,
      totalTicket: ticket.numberOfTicket,
      ticketIds: ticket.ticketIds
    })

    await payment.save();
    res.status(200).json({message: 'Payment initialize Successful',
      data: {
        reference: data?.reference,
        checkout_url: data?.checkout_url
      },
      paymentInfo: payment
    })

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error initializing payment",error:error.message
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
      `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${korapaySecret}`,
        },
      }
    );

    const { data } = response;
    const payment = await paymentModel.findOne({ reference: data?.data?.reference });

    if (!payment) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    const event = await eventModel.findById(payment.eventId);
    const tickets = await ticketModel.find({ _id: { $in: payment.ticketIds } });

    if (data?.status && data?.data?.status === 'success') {
      // Update event ticketSold
      event.ticketSold += payment.totalTicket;
      await event.save();

      // Update payment status
      payment.status = 'Successful';
      await payment.save();

      const firstName = tickets[0]?.fullName || payment.attendeeName;
      const email = tickets[0]?.email || payment.attendeeEmail;

      // Build ticket list HTML
      const ticketDetails = tickets.map(ticket => ({
        checkInCode: ticket.checkInCode,
        tableNumber: ticket.tableNumber,
        seatNumber: ticket.seatNumber,
        specialRequest: ticket.specialRequest,
        carAccess: ticket.carAccess
      }));

      const mailOptions = {
        email,
        subject: "Payment Successful",
        html: successfulPaymentTemplate({ firstName, ticketDetails }),
      };

      await send_mail(mailOptions);

      return res.status(200).json({ message: "Payment successful", data: payment });
    } else {
      // Mark as failed
      payment.status = 'Failed';
      await payment.save();

      const firstName = payment.attendeeName;
      const mailOptions = {
        email: payment.attendeeEmail,
        subject: "Payment Failed",
        html: failedPaymentTemplate(firstName),
      };

      await send_mail(mailOptions);

      return res.status(400).json({ message: "Payment not successful", data: payment });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error Verifying Payment', error: error.message });
  }
};


