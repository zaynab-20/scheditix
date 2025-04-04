const { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket } = require('../controllers/ticket');
const { validateTicket } = require('../middleware/validation'); 
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/create/ticket/{eventId}:
 *   post:
 *     summary: Create a ticket for an event
 *     description: Generates a ticket for a specific event if one doesn't already exist.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalTicketNumber:
 *                 type: integer
 *                 example: 200
 *               ticketType:
 *                 type: string
 *                 example: "VIP"
 *               ticketPrice:
 *                 type: number
 *                 format: float
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Ticket already exists or invalid input
 *       404:
 *         description: Event not found
 *       500:
 *         description: Error creating ticket
 */
router.post('/create/ticket/:eventId', validateTicket, createTicket);

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
 * /api/v1/ticket/{ticketId}:
 *   get:
 *     summary: Get ticket by ID
 *     description: Retrieve a specific ticket by its unique ID.
 *     tags:
 *       - Ticket Management
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ticket
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Error retrieving ticket
 */
router.get('/ticket/:ticketId', getTicketById);

/**
 * @swagger
 * /api/v1/ticket/{ticketId}:
 *   patch:
 *     summary: Update a ticket
 *     description: Update ticket details excluding the check-in code.
 *     tags:
 *       - Ticket Management
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
 *                 example: 300
 *               ticketType:
 *                 type: string
 *                 example: "Regular"
 *               ticketPrice:
 *                 type: number
 *                 format: float
 *                 example: 3000
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       400:
 *         description: Invalid update (e.g. checkInCode modification)
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Error updating ticket
 */
router.put('/ticket/:ticketId', validateTicket, updateTicket);

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
