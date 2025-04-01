const ticketModel = require("../models/ticket");
const eventModel = require("../models/event");
const generator = require("otp-generator");

exports.createTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { totalTicketNumber, ticketType, ticketPrice } = req.body;

    const event = await eventModel.findById(eventId);

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

    const checkInCode = generator.generate(8, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: false,
    });

    const existingTickets = await ticketModel.find({ eventId: eventId });

    let tableNumber = 1;
    let seatNumber = 1;

    if (existingTickets.length > 0) {
      const lastTicket = existingTickets[existingTickets.length - 1];
      tableNumber = lastTicket.tableNumber;
      seatNumber = lastTicket.seatNumber;

      if (seatNumber >= 5) { 
        tableNumber += 1; 
        seatNumber = 1; 
      } else {
        seatNumber += 1; 
      }
    }

    const newTicket = new ticketModel({
      eventId: event._id,
      eventTitle: event.title,
      totalTicketNumber,
      ticketType,
      ticketPrice,
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
    const updateFields = req.body;  

    if (updateFields.checkInCode) {
      return res.status(400).json({
        message: "checkInCode cannot be updated",
      });
    }

    // Update the ticket, excluding the checkInCode
    const ticket = await ticketModel.findByIdAndUpdate(ticketId, updateFields, { new: true });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({
      message: "Ticket updated successfully",
      data: ticket,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating ticket' });
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