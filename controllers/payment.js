const paymentModel = require("../models/payment");
const ticketModel = require("../models/ticket");
const eventModel = require("../models/event")
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
      message: "Error initializing payment",
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
    const { fullName, email, needCarPackingSpace, specialRequest } = payment; // Assuming fullName is saved in the payment

    const numberOfTicket = payment.numberOfTicket;

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
    console.log(response)

    if (data.status && data.data.status === 'success') {
      let total = ticket.soldTicket;
      ticket.soldTicket = total += 1;
      await ticket.save();
      payment.status = 'Successful'
      await payment.save();

      let response = []

      if (numberOfTicket > 1) {
        const numberOfTicket = payment.numberOfTicket;
            for(e = 1; e <= numberOfTicket; e++){
              const checkInCode = generator.generate(5, {
                upperCaseAlphabets: true,
                lowerCaseAlphabets: true,
                specialChars: false,
              });
          
              let table = event.tableNumber;
            let seat = event.seatNumber;
      
            if (seat <= event.seatPerTable) {
              seat += 1;
              event.seatNumber = seat;
              await event.save();
      
              if (seat > event.seatPerTable) {
                table += 1;
                event.tableNumber = table;
                event.seatNumber = 1;
                seat = event.seatNumber;
                await event.save();
              }
            }
      
            const newTicket = new ticketModel({
              eventId,
              fullName,
              email,
              numberOfTicket,
              checkInCode,
              tableNumber: table,
              seatNumber: seat,
              carAccess: needCarPackingSpace,
              specialRequest,
            });
            await newTicket.save();
            response.push(newTicket)
            }
            res.status(201).json({
              message: "Ticket created successfully",
              data: response,
            });
          } else {
            const checkInCode = generator.generate(5, {
              upperCaseAlphabets: true,
              lowerCaseAlphabets: true,
              specialChars: false,
            });
        
            let table = event.tableNumber;
            let seat = event.seatNumber;
      
            if (seat <= event.seatPerTable) {
              seat += 1;
              event.seatNumber = seat;
              await event.save();
      
              if (seat > event.seatPerTable) {
                table += 1;
                event.tableNumber = table;
                event.seatNumber = 1;
                seat = event.seatNumber;
                await event.save();
              }
              
            }
      
            const newTicket = new ticketModel({
              eventId: event._id,
              fullName,
              email,
              numberOfTicket,
              checkInCode,
              tableNumber: table,
              seatNumber: seat,
              carAccess: needCarPackingSpace,
              specialRequest,
            });

            await newTicket.save();
            res.status(201).json({
              message: "Ticket created successfully",
              data: newTicket,
            });
          }

          return res.status(400).json({ message: "Payment not successful" });
    }
  }catch(error){
    console.log(error.message)
    res.status(500).json({message: 'Error Verifying Payment'})
  }
};