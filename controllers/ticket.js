const ticketModel = require("../models/ticket");
const eventModel = require("../models/event");
const eventPlannerModel = require("../models/eventPlanner");
const generator = require("otp-generator");

exports.createTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      fullName,
      email,
      numberOfTicket,
      needCarPackingSpace,
      specialRequest,
    } = req.body;
    
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const eventPlanner = await eventPlannerModel.findById(event.eventPlannerId);
    if (!eventPlanner) {
      return res.status(404).json({ message: "Event planner not found" });
    }

    const ticketPurchaseLimit = event.ticketPurchaseLimit || 3;

    const purchasedTickets = await ticketModel.find({
      eventId,
      email,
    });

    if (purchasedTickets.length >= ticketPurchaseLimit) {
      return res.status(400).json({
        message: `You have reached the maximum limit of ${ticketPurchaseLimit} tickets for this event`,
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

    
    let response = []

    if (numberOfTicket > 1) {
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
        // await event.save()
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
      // await event.save();
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
        // await event.save()
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

      // await event.save();
      await newTicket.save();
      res.status(201).json({
        message: "Ticket created successfully",
        data: newTicket,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const { eventId } = req.params;

    const tickets = await ticketModel.find({ eventId });

    if (tickets.length === 0) {
      return res
        .status(404)
        .json({ message: "No tickets found for this event" });
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
      specialRequest,
    } = req.body;

    const data = {
      fullName,
      email,
      numberOfTicket,
      carAccess: needCarPackingSpace,
      specialRequest,
    };

    const updatedTicket = await ticketModel.findByIdAndUpdate(ticketId, data, {
      new: true,
    });

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
