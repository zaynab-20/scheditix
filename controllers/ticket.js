const ticketModel = require("../models/ticket");
const eventModel = require("../models/event");
const eventPlannerModel = require("../models/eventPlanner")
const generator = require("otp-generator");

exports.createTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { fullName,email,numberOfTicket,needCarPackingSpace,specialRequest } = req.body;

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

