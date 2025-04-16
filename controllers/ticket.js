const ticketModel = require("../models/ticket");
const eventModel = require("../models/event");
const eventPlannerModel = require("../models/eventPlanner")
const generator = require("otp-generator");

exports.createTicket = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await eventModel.findById(eventId).populate('eventPlannerId');

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    };

    const ticket = await ticketModel.findOne({eventId: eventId});

    if (ticket) {
      return res.status(400).json({
        message: 'Ticket already exist'
      })
    };

    const eventPlanner = await eventPlannerModel.findById(event.eventPlannerId);
    if (!eventPlanner) {
      return res.status(404).json({ message: "Event planner not found" });
    }

    
    if (eventPlanner.plan === "Basic" && totalTicketNumber > 100) {
      return res.status(403).json({
        message: "Basic plan limit: Maximum of 100 tickets per event",
      });
    }

    if (eventPlanner.plan === "Pro" && totalTicketNumber > 1000) {
      return res.status(403).json({
        message: "Pro plan limit: Maximum of 1000 tickets per event",
      });
    }

    const checkInCode = generator.generate(5, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: false,
    });

    let tableNumber = 0; 
    let seatNumber = 0;  
    
    if (ticket) { 
      tableNumber = ticket.totalTableNumber;
      seatNumber = ticket.totalSeatNumber;
    }    

    for(let t = 1; t <= tableNumber; t++){
      for(let s = 1; s <= seatNumber; s++){
        console.log(`table${t} seat${s}`)
      }
    }
    


    const newTicket = new ticketModel({
      eventId: event._id,
      eventTitle: event.title,
      totalTicketNumber: event.totalTicketNumber, 
      ticketPrice: event.ticketPrice, 
      tableNumber, 
      seatNumber,
      checkInCode
    });

    await newTicket.save();
    res.status(201).json({
      message: "ticket created successfully",
      data: newTicket,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error creating ticket'
    })
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const { eventId } = req.params;

    const tickets = await ticketModel.find({ eventId });

    if (tickets.length === 0) {
      return res.status(404).json({
        message: "No tickets found for this event",
      });
    }

    res.status(200).json({
      message: "Tickets retrieved successfully",
      data: tickets,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving tickets',
    });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await ticketModel.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      message: "Ticket retrieved successfully",
      data: ticket,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving ticket',
    });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { totalTicketNumber, ticketPrice } = req.body;

    
    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (req.body.checkInCode !== undefined) {
      return res.status(400).json({ message: "checkInCode cannot be updated" });
    }

    const Data = {
      totalTicketNumber: totalTicketNumber || ticket.totalTicketNumber,
      ticketPrice: ticketPrice || ticket.ticketPrice,
      tableNumber,
      seatNumber,
    };
    
    
    const updatedTicket = await ticketModel.findByIdAndUpdate(ticketId, Data, { new: true });

    if (!updatedTicket) {
      return res.status(500).json({ message: "Failed to update ticket" }); 
    }

    res.status(200).json({
      message: "Ticket updated successfully",
      data: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message }); 
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await ticketModel.findByIdAndDelete(ticketId);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error deleting ticket',
    });
  }
};


exports.purchaseTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { quantity } = req.body; 
    const userId = req.user.userId; // Authenticated user

    
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }


    const purchaseLimit = event.ticketPurchaseLimit;

    const ticket = await ticketModel.findOne({ eventId });

    if (!ticket || ticket.totalTicketNumber < 0) {
      return res.status(400).json({ message: 'No tickets available' });
    }

    const user = await eventPlannerModel.findById(userId);
    const userTickets = user.userTickets || 0; 

    if (userTickets + quantity > purchaseLimit) {
      return res.status(400).json({
        message: `You can only purchase a maximum of ${purchaseLimit} tickets.`
      });
    }

  
    if (ticket.totalTicketNumber - quantity < 0) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    ticket.totalTicketNumber -= quantity;
    ticket.soldTicket += quantity;

    await ticket.save();

    
    user.userTickets = userTickets + quantity; 
    await user.save();

    remainingTickets = ticket.totalTicketNumber - ticket.soldTicket;

    res.status(200).json({
      message: 'Tickets purchased successfully',
      data: {
        remainingTickets: ticket.totalTicketNumber,
        ticketsPurchased: user.userTickets
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};