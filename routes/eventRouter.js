const { createEvent, getOneEvent, getAllEvent, updateEvent, deleteEvent, getRecentEvents} = require('../controllers/eventController');
const {validateEvent} = require('../middleware/validation');
const { authenticate } = require('../middleware/authentication');
const upload = require('../utils/multer');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/create/event:
 *   post:
 *     summary: Create a new event
 *     description: Allows an authenticated user to create a new event, including uploading images.
 *     tags:
 *       - Event Management
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               eventTitle:
 *                 type: string
 *                 example: "Tech Summit 2025"
 *               eventDescription:
 *                 type: string
 *                 example: "A gathering of tech enthusiasts to explore emerging trends."
 *               eventCategory:
 *                 type: string
 *                 example: "Technology"
 *               eventLocation:
 *                 type: string
 *                 example: "Lagos, Nigeria"
 *               startTime:
 *                 type: string
 *                 format: time
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 format: time
 *                 example: "17:00"
 *               eventAgenda:
 *                 type: string
 *                 example: "Talks, Panels, Networking"
 *               eventRule:
 *                 type: string
 *                 example: "No refunds after registration."
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-03"
 *               totalTableNumber:
 *                 type: integer
 *                 example: 50
 *               totalSeatNumber:
 *                 type: integer
 *                 example: 300
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post("/create/event", authenticate, upload.array('image'), validateEvent, createEvent);
/**
 * @swagger
 * /api/v1/event/{eventId}:
 *   get:
 *     summary: Get one event
 *     description: Retrieves the details of a specific event by ID.
 *     tags:
 *       - Event Management
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to retrieve
 *     responses:
 *       200:
 *         description: Event found and returned successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/event/:eventId", getOneEvent);

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Get all events
 *     description: Retrieves a list of all available events.
 *     tags:
 *       - Event Management
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/events", getAllEvent);

/**
 * @swagger
 * /api/v1/update/event/{eventId}:
 *   patch:
 *     summary: Update an event
 *     description: Updates an existing event and replaces images if new ones are uploaded.
 *     tags:
 *       - Event Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to update
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               eventTitle:
 *                 type: string
 *               eventDescription:
 *                 type: string
 *               eventCategory:
 *                 type: string
 *               eventLocation:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               eventAgenda:
 *                 type: string
 *               eventRule:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               totalTableNumber:
 *                 type: integer
 *               totalSeatNumber:
 *                 type: integer
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/update/event/:id', authenticate, upload.array('image'), validateEvent, updateEvent);

/**
 * @swagger
 * api/v1/delete/event/{eventId}:
 *   delete:
 *     summary: Delete an event
 *     description: Deletes an event and its associated images from the database and Cloudinary.
 *     tags:
 *       - Event Management
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/delete/event/:id', authenticate, deleteEvent);

/**
 * @swagger
 * /api/v1/event/recent:
 *   get:
 *     summary: Get recent events
 *     description: Retrieves the 10 most recent events sorted by start date and includes status, ticket sales, revenue, and check-in data.
 *     tags:
 *       - Event Management
 *     responses:
 *       200:
 *         description: Successfully retrieved recent events
 *       500:
 *         description: Internal Server Error
 */
router.get('/event/recent',getRecentEvents)

module.exports = router;