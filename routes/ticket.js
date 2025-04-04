const { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket } = require('../controllers/ticket');
const { validateTicket } = require('../middleware/validation'); 
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/tickets/create/ticket/{eventId}:
 *   post:
 *     summary: Create a new ticket for an event
 *     description: This endpoint allows the creation of a new ticket for a specific event.
 *     parameters:
 *       - in: path
 *         name: eventId
 *         description: ID of the event for which the ticket is being created
 *         required: true
 *         type: string
 *       - in: body
 *         name: ticket
 *         description: Ticket creation details
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - totalTicketNumber
 *             - ticketType
 *             - ticketPrice
 *           properties:
 *             totalTicketNumber:
 *               type: integer
 *               example: 100
 *             ticketType:
 *               type: string
 *               example: "VIP"
 *             ticketPrice:
 *               type: number
 *               format: float
 *               example: 50.00
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             data:
 *               $ref: "#/definitions/Ticket"
 *       400:
 *         description: Ticket already exists
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/create/ticket/:eventId', validateTicket, createTicket);

/**
 * @swagger
 * /api/v1/tickets/{eventId}:
 *   get:
 *     summary: Get all tickets for an event
 *     description: Retrieves all tickets for a specific event.
 *     parameters:
 *       - in: path
 *         name: eventId
 *         description: ID of the event
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: List of tickets retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/Ticket"
 *       404:
 *         description: No tickets found for this event
 *       500:
 *         description: Internal Server Error
 */
router.get('/tickets/:eventId', getAllTickets);

/**
 * @swagger
 * /api/v1/ticket/{ticketId}:
 *   get:
 *     summary: Get a specific ticket by ID
 *     description: Retrieves a ticket by its unique ID.
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         description: ID of the ticket
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             data:
 *               $ref: "#/definitions/Ticket"
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/ticket/:ticketId', getTicketById);

/**
 * @swagger
 * /api/v1/ticket/{ticketId}:
 *   put:
 *     summary: Update a ticket
 *     description: Update an existing ticket by its ID (except for the check-in code).
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         description: ID of the ticket to update
 *         required: true
 *         type: string
 *       - in: body
 *         name: ticket
 *         description: Updated ticket details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             totalTicketNumber:
 *               type: integer
 *               example: 150
 *             ticketType:
 *               type: string
 *               example: "Regular"
 *             ticketPrice:
 *               type: number
 *               format: float
 *               example: 30.00
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             data:
 *               $ref: "#/definitions/Ticket"
 *       400:
 *         description: Cannot update checkInCode
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/ticket/:ticketId', validateTicket, updateTicket);

/**
 * @swagger
 * /api/v1/ticket/{ticketId}:
 *   delete:
 *     summary: Delete a ticket
 *     description: Delete a ticket by its unique ID.
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         description: ID of the ticket to delete
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/ticket/:ticketId', deleteTicket);

module.exports = router;
