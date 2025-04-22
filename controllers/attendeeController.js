const eventModel = require('../models/event');
const attendeeModel = require('../models/attendee');
const ticketModel = require('../models/ticket');

exports.checkInAttendee = async (req, res) => {
    try {
        const  { eventId } = req.params
        const { checkInCode } = req.body;
        const event = await eventModel.find(eventId)
        if(!event){
            return res.status(404).json({
                message:"event not found"
            })
        }
        if (!checkInCode) {
            return res.status(400).json({ message: "Check-in code is required" });
        }

       
        const attendee = await attendeeModel.findOne({ checkInCode });

        if (!attendee) {
            return res.status(404).json({ message: "Invalid check-in code" });
        }
 if (attendee.checkedIn) {
            return res.status(400).json({ message: "Attendee already checked in" });
        }
        attendee.checkedIn = true;
        await attendee.save();

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
}