const { checkInAttendee, getOneAttendee, getAllAttendees,  deletAttendee, searchByAttendeeName } = require('../controllers/attendeeController');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/checkin/{eventId}:
 *   post:
 *     summary: Check in an attendee for an event
 *     description: Verifies a check-in code and updates the attendee's status to "checked in" for a specific event.
 *     tags:
 *       - Attendees
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: The ID of the event where the attendee is checking in
 *         schema:
 *           type: string
 *           example: "6626b46393ad73991cd70c3f"
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
 *                 example: "ABC123XYZ"
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
 *                   example: Check-in successful
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Bad request - missing or invalid check-in code or already checked in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attendee already checked in
 *       404:
 *         description: Event or attendee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: event not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
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

/**
 * @swagger
 * /api/v1/searchByAttendeeName/{eventId}:
 *   get:
 *     summary: Search for attendees by full name within a specific event
 *     description: Retrieves attendees for a given event whose full name matches the search query (case-insensitive).
 *     tags:
 *       - Attendees
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
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: Attendee(s) found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: attendee found
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Full name not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: full name is required
 *       404:
 *         description: No attendees matched the search
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: attendee not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 *                   example: Error details
 */

router.get("/searchByAttendeeName/:eventId", searchByAttendeeName);


module.exports = router