const { checkAttendee, getOneAttendee, getAllAttendees, updateAttendee, deletAttendee } = require('../controllers/attendeeController');
const express = require('express');
const router = express.Router();

router.post('/check-in', checkAttendee);
router.get('/check/:attendeeId', getOneAttendee);
router.get('/attendees', getAllAttendees);
router.put('/updateattendee/:Id', updateAttendee)
router.delete('/deleteattendee', deletAttendee)

module.exports = router