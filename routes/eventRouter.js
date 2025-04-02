const express = require('express');
const router = express.Router();
const { validateEvent } = require('../middleware/validation');
const { authenticate } = require('../middleware/authentication');
const upload = require('../utils/multer'); 
const {createEvent,getOneEvent,getAllEvent,updateEvent,deleteEvent,getEventById} = require('../controllers/eventController');


router.post('/create', upload.array('image',10), createEvent);
router.get('/get-event', getAllEvent);
router.get('/oneEvent/:eventId', getOneEvent);
router.put('/update/:eventId', authenticate, upload.array('image'), validateEvent, updateEvent);
router.delete('/delete/:eventId', authenticate, deleteEvent);
router.get('/api/v1/events/:eventType/:eventId', getEventById);

module.exports = router;
