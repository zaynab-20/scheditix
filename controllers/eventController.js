const eventModel = require('../models/event')
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createEvent = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const {eventTitle,eventDate,eventTime,eventLocation,eventAgenda,eventDescription,speakers,eventCategory} = req.body;
    const file = req.file;

    let image = {};

    if (file && file.path) {
      const result = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path);

      image = {
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      };
    }

    const event = new eventModel({
      title, 
      date, 
      time, 
      location, 
      agenda, 
      description, 
      speakers, 
      eventType,
      organizerId,
      image,
      totalTableNumber,
      totalSeatNumber
    });
    await event.save();

    const sharableLink = `${req.protocol}://${req.get('host')}/api/v1/event/${eventCategory}/${eventId}`
    event.sharableLink = sharableLink
   

    // fs.unlinkSync(file.path);

    res.status(201).json({ message: "Event Created Successfully", data: event});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error: ", error: error.message });
  }
};



exports.getOneEvent = async (req, res) => {
  try {
    const { eventId } = req.params


    const event = await eventModel.findById(eventId)

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.status(200).json({ message: `kindly find the event below`, data: event})

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'internal server error' })
  }
};



exports.getAllEvent = async (req, res) => {
  try {
    const events = await eventModel.find();

    res.status(200).json({ message: 'Successfully Getting All Events', data: events})

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'internal server error' })
  }
};



exports.updateEvent = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const { eventId } = req.params;
    const { eventTitle, eventDate, eventTime, eventLocation, eventAgenda, eventDescription, speakers, eventCategory } = req.body;

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event Not Found' });
    }

    const data = {
      eventTitle,
      eventDate,
      eventTime,
      eventLocation,
      eventAgenda,
      eventDescription,
      speakers,
      eventCategory,
      organizerId
    };

    // If the event type or sharable link should be updated, include it
    if (req.body.eventCategory) {
      data.sharableLink = `${req.protocol}://${req.get('host')}/api/v1/event/${eventCategory}/${eventId}`;
    }

    if (req.file && req.file.path) {
      if (event.image && event.image.imagePublicId) {
        await cloudinary.uploader.destroy(event.image.imagePublicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path); 

      data.image = {
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      };
    }

    const updatedEvent = await eventModel.findByIdAndUpdate(eventId, data, { new: true });

    res.status(200).json({ message: 'Event Updated Successfully', data: updatedEvent });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await eventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.image && event.image.imagePublicId) {
      await cloudinary.uploader.destroy(event.image.imagePublicId);
    }

    const deletedEvent = await eventModel.findByIdAndDelete(eventId); 

    res.status(200).json({ message: 'Event deleted successfully',data:deletedEvent });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



exports.getEventById = async (req, res) => {
  try {
    const { eventCategory, eventId } = req.params;
    const event = await eventModel.findOne({ _id:eventId,eventCategory });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      message: 'Event fetched successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
