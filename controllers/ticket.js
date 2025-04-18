const ticketModel = require("../models/ticket");
const eventModel = require("../models/event");
const eventPlannerModel = require("../models/eventPlanner")
const generator = require("otp-generator");

exports.createTicket = async (req, res) => {
  try {
    const { eventId } = req.params; 
    const {fullName,email,numberOfTicket,needCarPackingSpace,specialRequest} = req.body;
    
    const event = await eventModel.findById(eventId);
    if (!event){
      return res.status(404).json({ message: "Event not found" });
    }
    
    const eventPlanner = event.eventPlannerId;
    const ticketPurchaseLimit = eventPlanner.ticketPurchaseLimit || 3;
    
    const purchasedTickets = await ticketModel.find({
      eventId,
      email,
    });

    if (purchasedTickets.length >= ticketPurchaseLimit) {
      return res.status(400).json({
        message: `You have reached the maximum limit of ${ticketPurchaseLimit} tickets for this event`
      });
    }

    if (eventPlanner.plan === "Basic" && event.totalQuantity > 100){
      return res.status(403).json({
        message: "Basic plan limit: Maximum of 100 tickets per event",
      });
    }

    if (eventPlanner.plan === "Pro" && event.totalQuantity > 1000){
      return res.status(403).json({
        message: "Pro plan limit: Maximum of 1000 tickets per event",
      });
    }

    const checkInCode = generator.generate(5, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: false,
    });

    // const ticket = await ticketModel.find()
    let tableNumber = 0;
    let seatNumber = 0;
    const totalTableNumber = event.totalTableNumber;
    const totalSeatNumber = event.totalSeatNumber;

    if (totalTableNumber <= event.totalTableNumber) {
      tableNumber += 1;
      seatNumber += 1
    }else{
      res.status(400).json({
        message: 'Ticket sold out'
      })
    }

    const newTicket = new ticketModel({
      eventId,
      fullName,
      email,
      numberOfTicket,
      checkInCode,
      tableNumber,
      seatNumber,
      carAccess: needCarPackingSpace,
      specialRequest
    });

    await newTicket.save();
    res.status(201).json({
      message: "Ticket created successfully",
      data: {
        name: fullName,
        email,
        seat: `Table ${tableNumber} Seat ${seatNumber}`,
        checkInCode,
        numberOfTicket,
        carAccess: needCarPackingSpace,
        specialRequest
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',error: error.message
    })
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const { eventId } = req.params;

    const tickets = await ticketModel.find({ eventId });

    if (tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found for this event" });
    }

    res.status(200).json({
      message: "Tickets retrieved successfully",
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getOneTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({
      message: "Ticket retrieved successfully",
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const {
      fullName,
      email,
      numberOfTicket,
      needCarPackingSpace,
      specialRequest
    } = req.body;

    const data = {
      fullName,
      email,
      numberOfTicket,
      carAccess: needCarPackingSpace,
      specialRequest
    };

    const updatedTicket = await ticketModel.findByIdAndUpdate(
      ticketId,
      data,{new: true}
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({
      message: "Ticket updated successfully",
      data: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


exports.deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const deletedTicket = await ticketModel.findByIdAndDelete(ticketId);
    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// exports.purchaseTicket = async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const { quantity } = req.body; 
//     const userId = req.user.userId; 

    
//     const event = await eventModel.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ message: 'Event not found' });
//     }


//     const purchaseLimit = event.ticketPurchaseLimit;

//     const ticket = await ticketModel.findOne({ eventId });

//     if (!ticket || ticket.totalTicketNumber < 0) {
//       return res.status(400).json({ message: 'No tickets available' });
//     }

//     const user = await eventPlannerModel.findById(userId);
//     const userTickets = user.userTickets || 0; 

//     if (userTickets + quantity > purchaseLimit) {
//       return res.status(400).json({
//         message: `You can only purchase a maximum of ${purchaseLimit} tickets.`
//       });
//     }

  
//     if (ticket.totalTicketNumber - quantity < 0) {
//       return res.status(400).json({ message: 'Not enough tickets available' });
//     }

//     ticket.totalTicketNumber -= quantity;
//     ticket.soldTicket += quantity;

//     await ticket.save();

    
//     user.userTickets = userTickets + quantity; 
//     await user.save();

//     remainingTickets = ticket.totalTicketNumber - ticket.soldTicket;

//     res.status(200).json({
//       message: 'Tickets purchased successfully',
//       data: {
//         remainingTickets: ticket.totalTicketNumber,
//         ticketsPurchased: user.userTickets
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// };