const eventModel = require("../models/event");
const cloudinary = require('../config/cloudinary');
const categoryModel = require("../models/category")
const eventPlannerModel = require("../models/eventPlanner")
const fs = require("fs");

exports.createEvent = async (req, res) => {
  try {
    // const organizerId = req.user.userId;
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
    const files = req.files;


    const eventPlanner = await eventPlannerModel.findById(req.user.userId);
    if (!eventPlanner) {
      return res.status(404).json({ message: "Event Planner not found" });
    }

    if (eventPlanner.plan === 'Basic') {
      const eventsCreated = await eventModel.countDocuments({ eventPlannerId: req.user.userId });
    
      if (eventsCreated == 2) {
        return res.status(403).json({ message: "Basic plan limit: You can only create 2 events." });
      }
    }
    
    
    let result;
    let imagePath = {};
    let image = []

    if (files && files[0]) {
      for (const images of files) {
        result = await cloudinary.uploader.upload(images.path);
        fs.unlinkSync(images.path);
        imagePath = {
          imageUrl: result.secure_url,
          imagePublicId: result.public_id,
        }
        image.push(imagePath)
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
      startDate,
      endDate,
      totalTableNumber,
      totalSeatNumber,
      totalTicketNumber,   
      ticketPrice,
      ticketQuantity, 
      ticketPurchaseLimit,     
      parkingAccess,
      image: image,
      eventPlannerId:req.user.userId,
      featured: isFeatured
    });
    await event.save();
    res
      .status(201)
      .json({ message: "Event Created Successfully", data: event });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error: ", error: error.message });
  }
};

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
    // const organizerId = req.user.userId;
    const { eventId,categoryId} = req.params;
    const {eventLocation,startTime,endTime,startDate,endDate} = req.body;

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

    if(req.files && req.files.length > 0){
      for(const image of event.images){
        await cloudinary.uploader.destroy(image.imagePublicId)
      }
      const image = []
      
      for(const image of req.files){
        const result = await cloudinary.uploader.upload(image.path)
        fs.unlinkSync(image.path)
        const photo = {
          imageUrl: result.secure_url,
          imagePublicId: result.public_id
        }
        image.push(photo)
      }
      data.images = image;
    }

    const updatedEvent = await eventModel.findByIdAndUpdate(eventId, data, {
      new: true,
    }).populate('eventCategory','categoryName');

    res
      .status(200)
      .json({ message: "Event Updated Successfully", data: updatedEvent });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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

exports.getFeaturedEvents = async (req, res) => {
  try {
      const featuredEvents = await eventModel.find({ featured: true }).populate('eventCategory', 'categoryName');
      res.status(200).json({
          message: "Successfully retrieved featured events",
          data: featuredEvents
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


exports.getTrendingEvents = async (req, res) => {
  try {
      const trendingEvents = await eventModel.find()
          .sort({ ticketSold: -1 }) // Sort in descending order based on ticketSold
          .limit(5) // Limit to, say, the top 10 trending events
          .populate('eventCategory', 'categoryName');

      res.status(200).json({
          message: "Successfully retrieved trending events",
          data: trendingEvents
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


exports.getOverview = async (req, res) => {
  try {
      // 1. Get all the events from your database
      const allEvents = await eventModel.find();

      const dashboard = allEvents.reduce((accumulator, currentEvent) => {
          accumulator.totalTicketSold += currentEvent.ticketSold || 0;
          accumulator.totalRevenue += currentEvent.revenueGenerated || 0;

          return accumulator;
      }, {
          totalTicketSold: 0,
          totalRevenue: 0
      });

      // 3. Get the total number of unique event organizers
      const totalEventOrganizers = await eventModel.distinct('eventPlannerId').countDocuments();

      // 4. Combine all the stats into one object
      const overview = {
          totalTicketSold: dashboard.totalTicketSold,
          totalRevenue: dashboard.totalRevenue,
          totalEventOrganizers: totalEventOrganizers
      };
      res.status(200).json({
          message: "Successfully retrieved dashboard statistics",
          data: overview
      });

  } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};