const eventModel = require("../models/event");
const cloudinary = require('../config/cloudinary');
const fs = require("fs");

exports.createEvent = async (req, res) => {
  try {
    // const organizerId = req.user.userId;
    const {eventTitle,
           eventDescription,
           eventCategory,
           eventLocation,
           startTime,
           endTime,
           eventAgenda,
           eventRule,
           startDate,
           endDate,
           totalTableNumber,
           totalSeatNumber
    } = req.body;
    const files = req.files;
    
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

    const event = new eventModel({
      eventTitle,
      eventDescription,
      eventCategory,
      eventLocation,
      startTime,
      endTime,
      eventAgenda,
      eventRule,
      startDate,
      endDate,
      totalTableNumber,
      totalSeatNumber,
      image: image,
      eventPlannerId: req.user.eventPlannerId
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

    const event = await eventModel.findById(eventId);

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
    const events = await eventModel.find();

    res
      .status(200)
      .json({ message: "Successfully Getting All Events", data: events });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    // const organizerId = req.user.userId;
    const { eventId } = req.params;
    const {eventTitle,eventDescription,eventCategory,eventLocation,startTime,endTime,eventAgenda,eventRule,totalTableNumber,totalSeatNumber,
    } = req.body;

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event Not Found" });
    }

    const data = {
      eventTitle,
      eventDescription,
      eventCategory,
      eventLocation,
      startTime,
      endTime,
      eventAgenda,
      eventRule,
      startDate,
      endDate,
      totalTableNumber,
      totalSeatNumber
    };

    if(req.files && req.file[0]){
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
    });

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

    const events = await eventModel.find()
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
        ticketSold: `${event.ticketSold || 0}/${event.totalTicketNumber || 0}`, 
        totalAttendee: event.totalAttendee || 0, 
        revenueGenerated: event.revenueGenerated || 0, 
        checkins: event.checkins || 0, 
        status: status
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
