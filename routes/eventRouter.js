const { createEvent, getOneEvent, getAllEvent, updateEvent, deleteEvent} = require('../controllers/eventController');
const {validateEvent} = require('../middleware/validation');
const { authenticate } = require('../middleware/authentication');
const upload = require('../utils/multer');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /create/event:
 *   post:
 *     summary: Create a new event
 *     description: This endpoint allows an event planner to create a new event.
 *     parameters:
 *       - in: body
 *         name: event
 *         description: Event creation details
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - eventTitle
 *             - eventDescription
 *             - eventCategory
 *             - eventLocation
 *             - startTime
 *             - endTime
 *             - eventAgenda
 *             - eventRule
 *             - startDate
 *             - endDate
 *             - totalTableNumber
 *             - totalSeatNumber
 *           properties:
 *             eventTitle:
 *               type: string
 *               example: "Wedding Celebration"
 *             eventDescription:
 *               type: string
 *               example: "A beautiful wedding celebration."
 *             eventCategory:
 *               type: string
 *               example: "Wedding"
 *             eventLocation:
 *               type: string
 *               example: "Downtown Hall"
 *             startTime:
 *               type: string
 *               format: time
 *               example: "14:00"
 *             endTime:
 *               type: string
 *               format: time
 *               example: "18:00"
 *             eventAgenda:
 *               type: string
 *               example: "Speech, Dinner, Dancing"
 *             eventRule:
 *               type: string
 *               example: "No smoking or drinking"
 *             startDate:
 *               type: string
 *               format: date
 *               example: "2025-05-10"
 *             endDate:
 *               type: string
 *               format: date
 *               example: "2025-05-10"
 *             totalTableNumber:
 *               type: integer
 *               example: 10
 *             totalSeatNumber:
 *               type: integer
 *               example: 100
 *             image:
 *               type: string
 *               format: binary
 *               description: "Upload a cover image for the event"
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/create/event', authenticate, upload.array('image'), validateEvent, createEvent);
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     description: This endpoint allows an event planner to retrieve a list of all events.
 *     responses:
 *       200:
 *         description: List of events retrieved successfully
 *       404:
 *         description: No events found
 */
router.get('/events', getAllEvent);

/**
 * @swagger
 * /update/event/{id}:
 *   put:
 *     summary: Update an event
 *     description: This endpoint allows an event planner to update the details of an existing event.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the event to update
 *         required: true
 *         type: string
 *       - in: body
 *         name: event
 *         description: Updated event details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             eventTitle:
 *               type: string
 *               example: "Wedding Celebration"
 *             eventDescription:
 *               type: string
 *               example: "A beautiful wedding celebration."
 *             eventCategory:
 *               type: string
 *               example: "Wedding"
 *             eventLocation:
 *               type: string
 *               example: "Downtown Hall"
 *             startTime:
 *               type: string
 *               format: time
 *               example: "14:00"
 *             endTime:
 *               type: string
 *               format: time
 *               example: "18:00"
 *             eventAgenda:
 *               type: string
 *               example: "Speech, Dinner, Dancing"
 *             eventRule:
 *               type: string
 *               example: "No smoking or drinking"
 *             startDate:
 *               type: string
 *               format: date
 *               example: "2025-05-10"
 *             endDate:
 *               type: string
 *               format: date
 *               example: "2025-05-10"
 *             totalTableNumber:
 *               type: integer
 *               example: 10
 *             totalSeatNumber:
 *               type: integer
 *               example: 100
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Event not found
 */
router.put('/update/event/:id', authenticate, validateEvent, updateEvent);

/**
 * @swagger
 * /delete/event/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: This endpoint allows an event planner to delete an event by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the event to delete
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete('/delete/event/:id', authenticate, deleteEvent);

module.exports = router;