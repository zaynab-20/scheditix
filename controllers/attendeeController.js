const eventModel = require('../models/event');
const attendeeModel = require('../models/attendee');
const ticketModel = require('../models/ticket');

exports.checkInAttendee = async (req, res) => {
    try {
        const  { eventId } = req.params
        const { checkInCode } = req.body;
        const event = await eventModel.findById(eventId)
        if(!event){
            return res.status(404).json({
                message:"event not found"
            })
        }
        if (!checkInCode) {
            return res.status(400).json({ message: "Check-in code is required" });
        }

       
        const attendee = await ticketModel.findOne({ checkInCode });

        if (!attendee) {
            return res.status(404).json({ message: "Invalid check-in code" });
        }
        if (attendee.checkedIn === "Yes") {
            return res.status(400).json({ message: "Attendee already checked in" });
        }
        attendee.checkedIn = "Yes";
        event.noOfCheckings += 1; 
        // event.revenueGenerated += attendee.ticketPrice; // Add the ticket price to the event's revenue
        await attendee.save();
        await event.save(); 

        res.status(200).json({
            message: "Check-in successful",
            data: attendee
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOneAttendee = async (req,res) =>{
    try {
        const { attendeeId } = req.params 
        
        const attendee = await attendeeModel.findById(attendeeId)
        if(!attendee){
            return res.status(404).json({
                message:"attendee not found"
            })
        }
        return res.status(200).json({
            message:"attendee found"
        })
    } catch (error) {
        res.status(500).json({
            message:'Internal Server Error',error:error.message
        })
    }
}
exports.getAllAttendees = async (req,res) =>{
    try {
        const {eventId} = req.params
        const attendees = await ticketModel.find({eventId})
        res.status(200).json({
            message:"all tickets found",
            data:attendees
            
        })
    } catch (error) {
        res.status(500).json({
            message:'Internal Server Error',error:error.message
        })
    }
}
exports.deletAttendee = async (req,res) => {
    try {
        const { attendeeId } = req.params

        const attendee = await attendeeModel.findById(attendeeId)
        
        if(!attendee){
            return res.status(404).json({
                message:"attendee not found"
            })
        }
        const deleteAttendee = await attendeeModel.findByIdAndDelete(attendeeId)
        return res.status(200).json({
            messsage:"attendee deleted successfully",
            data:deleteAttendee
        })
    } catch (error) {
        res.status(500).json({
            message:'Internal Server Error',error:error.message
        })
    }
};

exports.searchByAttendeeName = async (req,res) => {
    try {
        const { eventId } = req.params;
        const {fullName} = req.body;
        if (!fullName) {
            return res.status(400).json({
                message:"full name is required"
            })
        }
        const attendees = await ticketModel.find({eventId, fullName : { $regex: fullName, $options: 'i' }})
        if(!attendees){
            return res.status(404).json({
                message:"attendee not found"
            })
        }
    
         res.status(200).json({
            message:"attendee found",
            data:attendees
        })
    } catch (error) {
        log(error.message)
        res.status(500).json({
            message:'Internal Server Error',error:error.message
        })
    }
}