const { checkInAttendee, getOneAttendee, getAllAttendees,  deletAttendee } = require('../controllers/attendeeController');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /check-in/{eventId}:
 *   post:
 *     summary: Check in an attendee using a check-in code
 *     tags:
 *       - Attendees
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event
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
 *                 description: Unique code used to check in the attendee
 *     responses:
 *       200:
 *         description: Check-in successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Attendee'
 *       400:
 *         description: Bad request (e.g. already checked in or missing code)
 *       404:
 *         description: Event or attendee not found
 *       500:
 *         description: Server error
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
router.get('/attendees/:eventId', getAllAttendees);

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