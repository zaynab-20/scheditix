const { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket } = require('../controllers/ticket');
// const { validateTicket } = require('../middleware/validation'); 
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/create/ticket/{eventId}:
 *   post:
 *     summary: Create a ticket for an event
 *     description: Generates a ticket for a specific event if one doesn't already exist. The ticket details such as total ticket number, price, etc., are derived from the event.
 *     tags:
 *       - Ticket Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to create a ticket for
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Ticket already exists for the event
 *       403:
 *         description: Plan limit exceeded (for "Basic" and "Pro" plans)
 *       404:
 *         description: Event or Event Planner not found
 *       500:
 *         description: Error creating ticket
 */
router.post('/create/ticket/:eventId',createTicket);
// router.post('/create/ticket/:eventId', validateTicket, createTicket);

/**
 * @swagger
 * /api/v1/tickets/{eventId}:
 *   get:
 *     summary: Get all tickets for an event
 *     description: Retrieve all tickets that belong to a specific event.
 *     tags:
 *       - Ticket Management
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
 *       404:
 *         description: No tickets found for this event
 *       500:
 *         description: Error retrieving tickets
 */
router.get('/tickets/:eventId', getAllTickets);

/**
 * @swagger
 * /api/v1/update/ticket/{ticketId}:
 *   put:
 *     summary: Update ticket information
 *     description: Allows the update of ticket properties such as `totalTicketNumber` and `ticketPrice`.
 *     tags:
 *       - Ticket Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ticket to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalTicketNumber:
 *                 type: integer
 *                 example: 250
 *               ticketPrice:
 *                 type: number
 *                 format: float
 *                 example: 6000
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid update request (e.g., trying to update `checkInCode`)
 *       404:
 *         description: Ticket or Event not found
 *       500:
 *         description: Error updating ticket
 */
router.put('/update/ticket/:ticketId', updateTicket);
// router.put('/ticket/:ticketId', validateTicket, updateTicket);

/**
 * @swagger
 * /api/v1/ticket/{ticketId}:
 *   delete:
 *     summary: Delete a ticket
 *     description: Delete a ticket by its unique ID.
 *     tags:
 *       - Ticket Management
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ticket to delete
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Error deleting ticket
 */
router.delete('/ticket/:ticketId', deleteTicket);

module.exports = router;
