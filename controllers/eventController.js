const eventModel = require("../models/event");
const cloudinary = require('../config/cloudinary');
const categoryModel = require("../models/category")
const eventPlannerModel = require("../models/eventPlanner")
const fs = require("fs");
const ticketModel = require("../models/ticket");

exports.createEvent = async (req, res) => {
  try {
    const {userId} = req.user;
    const {categoryId} = req.params;
    const {eventTitle,
           eventDescription,
           eventLocation,
           startTime,
           endTime,
           eventAgenda,
           eventRule,
           startDate,   
           endDate,
           totalTableNumber,
           totalSeatNumber,
           ticketPrice,
           ticketQuantity, 
           ticketPurchaseLimit,
           parkingAccess
    } = req.body;
    const file = req.file;

    const formattedStartDate = new Date(startDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const formattedEndDate = new Date(endDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Event category not found"
      })
    }

    const eventPlanner = await eventPlannerModel.findById(userId);

    if (!eventPlanner) {
      return res.status(404).json({ message: "Event Planner not found" });
    }

    if (eventPlanner.plan === 'Basic') {
      const eventsCreated = await eventModel.countDocuments({ eventPlannerId: userId });
    
      if (eventsCreated == 2) {
        return res.status(403).json({ message: "Basic plan limit: You can only create 2 events." });
      }
    }
    let image = {};


    if (file && file.path) {
      const result = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path);

      image = {
        imageUrl: result.secure_url,
        imagePublicId: result.public_id
      }
      
    }

    let isFeatured = false;
    if (req.user && req.user.plan === 'Premium') {
      isFeatured = true;
    }

    const event = new eventModel({
      eventTitle,
      eventDescription,
      eventCategory: categoryId,
      eventLocation,
      startTime,
      endTime,
      eventAgenda,
      eventRule,
      startDate:formattedStartDate,
      endDate:formattedEndDate,
      totalTableNumber,
      totalSeatNumber,
      seatPerTable: totalSeatNumber/totalTableNumber,
      ticketPrice,
      ticketQuantity,
      ticketPurchaseLimit,
      parkingAccess,
      image,
      eventPlannerId: eventPlanner._id,
      featured: isFeatured
    });
    category.events.push(event._id)
    await event.save();
    await category.save();
    res
      .status(201)
      .json({ message: "Event Created Successfully", data: event });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error: ", error: error.message });
  }
}

exports.getOneEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await eventModel.findById(eventId).populate('eventCategory','categoryName');

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res
      .status(200)
      .json({ message: `kindly find the event below`, data: event });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.getAllEvent = async (req, res) => {
  try {
    const events = await eventModel.find().populate('eventCategory','categoryName');

    res
      .status(200)
      .json({ message: "Successfully Getting All Events", data: events });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};


exports.getAllEventCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const events = await eventModel.find({ eventCategory: categoryId }).populate('eventCategory', 'categoryName');

    res.status(200).json({
      message: `Successfully Getting Events for Category ID`,
      data: events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { eventId, categoryId } = req.params;
    const { eventLocation, startTime, endTime, startDate, endDate } = req.body;

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event Not Found" });
    }

    const data = {
      eventLocation,
      startTime,
      endTime,
      startDate,
      endDate,
    };

    // Handle image update
    if (req.file && req.file.path) {
      // Delete the old image from Cloudinary
      if (event.image && event.image.imagePublicId) {
        await cloudinary.uploader.destroy(event.image.imagePublicId);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path); // Delete local file

      // Set new image data
      data.image = {
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      };
    }

    const updatedEvent = await eventModel
      .findByIdAndUpdate(eventId, data, { new: true })
      .populate("eventCategory", "categoryName");

    res
      .status(200)
      .json({ message: "Event Updated Successfully", data: updatedEvent });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



exports.getRecentEvents = async (req, res) => {
  try {
    // Get current date
    const currentDate = new Date();

    const events = await eventModel.find().populate('eventCategory','categoryName')
      .sort({ startDate: -1 }) 
      .limit(10);

    const recentEvents = events.map(event => {
      let status;
      if (new Date(event.endDate) < currentDate) {
        status = 'completed';
      } else if (new Date(event.startDate) <= currentDate && new Date(event.endDate) >= currentDate) {
        status = 'ongoing';
      } else {
        status = 'upcoming';
      }
      
      return {
        eventName: event.eventTitle,
        ticketSold: `${event.ticketSold || 0}/${event.totalSeatNumber || 0}`, 
        totalAttendee: event.totalAttendee || 0, 
        revenueGenerated: event.revenueGenerated || 0, 
        checkins: event.checkins || 0, 
        status: status,
        eventCategory: event.eventCategory.categoryName
      };
    });

    res.status(200).json({
      message: "Successfully retrieved recent events",
      data: recentEvents
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};


exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await eventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.image && event.image.imagePublicId) {
      await cloudinary.uploader.destroy(event.image.imagePublicId);
    }

    const deletedEvent = await eventModel.findByIdAndDelete(eventId);

    res
      .status(200)
      .json({ message: "Event deleted successfully", data: deletedEvent });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getFeaturedEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const featuredEvent = await eventModel.findOne({
      _id: eventId,
      featured: true
    }).populate('eventCategory', 'categoryName');

    if (!featuredEvent) {
      return res.status(404).json({ message: "Featured event not found" });
    }

    res.status(200).json({
      message: "Successfully retrieved featured event",
      data: featuredEvent
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



exports.getTrendingEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const trendingEvent = await eventModel.findOne({
      _id: eventId
    }).populate('eventCategory', 'categoryName');

    if (!trendingEvent) {
      return res.status(404).json({ message: "Trending event not found" });
    }

    res.status(200).json({
      message: "Successfully retrieved trending event",
      data: trendingEvent
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


exports.getOverview = async (req, res) => {
  try {
    const eventPlannerId = req.userId; // Make sure req.user is set by your auth middleware

    // Get all events created by the logged-in event planner
    const myEvents = await eventModel.find({ eventPlannerId });

    const dashboard = myEvents.reduce((accumulator, currentEvent) => {
      accumulator.totalTicketSold += currentEvent.ticketSold || 0;
      accumulator.totalRevenue += currentEvent.revenueGenerated || 0;
      return accumulator;
    }, {
      totalTicketSold: 0,
      totalRevenue: 0
    });

    const overview = {
      totalEventsOrganized: myEvents.length,
      totalTicketSold: dashboard.totalTicketSold,
      totalRevenue: dashboard.totalRevenue
    };

    return res.status(200).json({
      message: "Successfully retrieved your dashboard overview",
      data: overview
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



exports. getPaginatedEvents = async (req, res) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 7;
    const skip = (page - 1) * limit;

    let query = Event.find();
    query = query.skip(skip).limit(limit);

    const eventCount = await Event.countDocuments();
    if (skip >= eventCount) {
      return res.status(404).json({ message: "events not found" });
    }

    const events = await query;
    res.status(200).json({
      total: eventCount,
      currentPage: page,
      totalPages: Math.ceil(eventCount / limit),
      data: events
    });

  } catch (error) {
    res.status(500).json({ message:'Internal Server Error',error:error.message});
  }
};


exports.eventPlannerEvent = async (req, res) => {
  try {
    const { eventPlannerId } = req.params;

    const events = await eventModel.find({ eventPlannerId });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found for this event planner" });
    }

    res.status(200).json({
      message: "Events retrieved successfully",
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



exports.getSingleEvent = async (req, res) => {
  try {
    const { eventId, eventPlannerId } = req.params;

    const event = await eventModel.findOne({ _id: eventId, eventPlannerId });

    if (!event) {
      return res.status(404).json({ message: "Event not found for this event planner" });
    }

    res.status(200).json({
      message: "Event retrieved successfully",
      data: event
    });
  } catch (error) {
    console.error("Error fetching event:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.searchEventCategory = async (req, res) => {
  try {
    const { categoryName } = req.query;

    if (!categoryName) {
      return res.status(404).json({ message: 'Category name not found' });
    }

    const searchEvent = await eventModel.find({eventCategory: { $regex: categoryName, $options: "i" }});

    if (searchEvent.length === 0) {
      return res.status(404).json({ message: 'No events found in this category' });
    }

    res.status(200).json({
      message: 'Events found successfully',
      data: searchEvent,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


// exports.searchEventTitle = async(req,res) => {
//   try{
//     const {eventTitle} = req.body
//     const searchTitle = await eventModel.findOne({eventTitle:eventTitle})
//     if(!searchTitle){
//       return res.status(400).json({message: 'Event Title not found'})
//     }

//     res.status(200).json({
//       message: 'Event found successfully',
//       data: searchTitle,
//     });
//   }catch(error){
//     res.status(500).json({message: 'Internal Server Error', error:error.message})
//   }
// }

exports.getAllUpcomingEventsByAUser = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the request

    // Find the event planner (optional, if needed for validation)
    const planner = await eventPlannerModel.findById(userId);
    if (!planner) {
      return res.status(404).json({ message: "Event planner not found" });
    }

    // Fetch tickets for the user
    const tickets = await ticketModel.find({ userId });
    
    // Store all upcoming events
    const allEvents = [];

    // Loop through the tickets and get the associated events
    for (const ticket of tickets) {
      const event = await eventModel.findById(ticket.eventId);

      if (event) {
        // Parse the startDate string into a Date object
        const eventStartDate = new Date(event.startDate); // Assuming startDate is a string in the correct format

        // Compare if the event's start date is in the future
        const currentDate = new Date(); // Get current date and time

        if (eventStartDate > currentDate) {
          // If the event start date is in the future, add it to the list
          allEvents.push(event);
        }
      }
    }

    // Check if we found any upcoming events
    if (allEvents.length === 0) {
      return res.status(404).json({ message: "No upcoming events found for this user" });
    }

    // Return the upcoming events
    res.status(200).json({ message: "Successfully fetched upcoming events", data: allEvents });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getAllPastEventsByAUser = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the request

    // Find the event planner (optional, if needed for validation)
    const planner = await eventPlannerModel.findById(userId);
    if (!planner) {
      return res.status(404).json({ message: "Event planner not found" });
    }

    // Fetch tickets for the user
    const tickets = await ticketModel.find({ userId });
    
    // Store all past events
    const allPastEvents = [];

    // Loop through the tickets and get the associated events
    for (const ticket of tickets) {
      const event = await eventModel.findById(ticket.eventId);

      if (event) {
        // Parse the startDate string into a Date object
        const eventStartDate = new Date(event.startDate); // Assuming startDate is a string in the correct format

        // Compare if the event's start date is in the past
        const currentDate = new Date(); // Get current date and time

        if (eventStartDate < currentDate) {
          // If the event start date is in the past, add it to the list
          allPastEvents.push(event);
        }
      }
    }

    // Check if we found any past events
    if (allPastEvents.length === 0) {
      return res.status(404).json({ message: "No past events found for this user" });
    }

    // Return the past events
    res.status(200).json({ message: "Successfully fetched past events", data: allPastEvents });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

