const { checkInAttendee, getOneAttendee, getAllAttendees,  deletAttendee } = require('../controllers/attendeeController');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/check-in/{eventId}:
 *   post:
 *     tags: [Attendees]
 *     summary: Check in an attendee for an event
 *     description: Creates a check-in record for an attendee using the event ID and check-in code.
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - checkInCode
 *             properties:
 *               checkInCode:
 *                 type: string
 *                 example: SCHD12345
 *     responses:
 *       201:
 *         description: Attendee checked in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: attendee checked in successfully
 *                 data:
 *                   $ref: '#/components/schemas/Attendee'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.post('/check-in/:eventId', checkInAttendee);


/**
 * @swagger
 * /api/v1/check/{attendeeId}:
 *   get:
 *     tags: [Attendees]
 *     summary: Get a single attendee
 *     description: Retrieve an attendee using their unique attendee ID.
 *     parameters:
 *       - in: path
 *         name: attendeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the attendee to retrieve
 *     responses:
 *       200:
 *         description: Attendee found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: attendee found
 *                 data:
 *                   $ref: '#/components/schemas/Attendee'
 *       404:
 *         description: Attendee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: attendee not found
 *       500:
 *         description: Server error
 */
router.get('/check/:attendeeId', getOneAttendee);

/**
 * @swagger
 * /api/v1/attendees:
 *   get:
 *     tags: [Attendees]
 *     summary: Retrieve all attendees
 *     description: Get a list of all attendees in the database.
 *     responses:
 *       200:
 *         description: A list of attendees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: all attendees found
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attendee'
 *       500:
 *         description: Server error
 */
router.get('/attendees', getAllAttendees);

/**
 * @swagger
 * /api/v1/deleteattendee/{attendeeId}:
 *   delete:
 *     tags: [Attendees]
 *     summary: Delete an attendee
 *     description: Deletes an attendee by their ID.
 *     parameters:
 *       - in: path
 *         name: attendeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the attendee to delete
 *     responses:
 *       200:
 *         description: Attendee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: attendee deleted successfully
 *                 data:
 *                   $ref: '#/components/schemas/Attendee'
 *       404:
 *         description: Attendee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: attendee not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteattendee/:attendeeId', deletAttendee);

module.exports = router