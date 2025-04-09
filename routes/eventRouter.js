const { createEvent, getOneEvent, getAllEvent, updateEvent, deleteEvent, getRecentEvents} = require('../controllers/eventController');
const {validateEvent} = require('../middleware/validation');
const { authenticate } = require('../middleware/authentication');
const upload = require('../utils/multer');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/create/event/{categoryNameId}:
 *   post:
 *     summary: Create a new event
 *     description: Allows an authenticated user to create a new event, including uploading images.
 *     tags:
 *       - Event Management
 *     parameters:
 *       - in: path
 *         name: categoryNameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to which the event belongs
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
 *                   description: Upload one or more event images
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post("/create/event/:categoryNameId", authenticate, upload.array('image'), validateEvent, createEvent);

/**
 * @swagger
 * /api/v1/event/{eventId}:
 *   get:
 *     summary: Retrieve a single event by its ID
 *     description: Fetches the details of a specific event, including its category name.
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
 *         description: Event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kindly find the event below"
 *                 data:
 *                   type: object
 *                   description: The event details
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
 *     summary: Retrieve all events
 *     description: Fetches a list of all events, including their associated category name.
 *     tags:
 *       - Event Management
 *     responses:
 *       200:
 *         description: Successfully retrieved all events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully Getting All Events"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Event details
 *       500:
 *         description: Internal Server Error
 */
router.get("/events", getAllEvent);

/**
 * @swagger
 * /api/v1/update/event/{eventId}/{categoryNameId}:
 *   put:
 *     summary: Update an existing event
 *     description: Allows an authenticated user to update an event, including modifying its details and uploading new images.
 *     tags:
 *       - Event Management
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to be updated
 *       - in: path
 *         name: categoryNameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update the event with
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
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event Updated Successfully"
 *                 data:
 *                   type: object
 *                   description: Updated event details
 *       400:
 *         description: Bad request, invalid input
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/update/event/:eventId/:categoryNameId", authenticate, upload.array('image'), updateEvent);


/**
 * @swagger
 * /api/v1/delete/event/{eventId}:
 *   delete:
 *     summary: Delete an event
 *     description: Allows an authenticated user to delete an event by its ID, including its associated images.
 *     tags:
 *       - Event Management
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to be deleted
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event deleted successfully"
 *                 data:
 *                   type: object
 *                   description: Deleted event details
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/delete/event/:eventId", authenticate, deleteEvent);


/**
 * @swagger
 * /api/v1/recent/events:
 *   get:
 *     summary: Get the most recent events
 *     description: Retrieves the most recent events, including their status (upcoming, ongoing, completed), ticket sold, total attendees, revenue generated, and check-ins.
 *     tags:
 *       - Event Management
 *     responses:
 *       200:
 *         description: Successfully retrieved recent events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully retrieved recent events"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       eventName:
 *                         type: string
 *                         example: "Tech Summit 2025"
 *                       ticketSold:
 *                         type: string
 *                         example: "150/300"
 *                       totalAttendee:
 *                         type: integer
 *                         example: 150
 *                       revenueGenerated:
 *                         type: number
 *                         format: float
 *                         example: 500000
 *                       checkins:
 *                         type: integer
 *                         example: 100
 *                       status:
 *                         type: string
 *                         enum: [upcoming, ongoing, completed]
 *                         example: "ongoing"
 *                       eventCategory:
 *                         type: string
 *                         example: "Technology"
 *       500:
 *         description: Internal Server Error
 */
router.get("/recent/events", authenticate, getRecentEvents);

module.exports = router;