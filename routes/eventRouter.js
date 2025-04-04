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
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - eventTitle
 *               - eventDescription
 *               - eventCategory
 *               - eventLocation
 *               - startTime
 *               - endTime
 *               - eventAgenda
 *               - eventRule
 *               - startDate
 *               - endDate
 *               - totalTableNumber
 *               - totalSeatNumber
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
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *               eventAgenda:
 *                 type: string
 *               eventRule:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               totalTableNumber:
 *                 type: integer
 *               totalSeatNumber:
 *                 type: integer
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload one or more images
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
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to update
 *     requestBody:
 *       required: true
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
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *               eventAgenda:
 *                 type: string
 *               eventRule:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               totalTableNumber:
 *                 type: integer
 *               totalSeatNumber:
 *                 type: integer
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload one or more images
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Event not found
 */
router.put('/update/event/:id',  authenticate, upload.array('image'), validateEvent,updateEvent);

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