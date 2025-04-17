const { createTicket, getAllTickets, getOneTicketById,deleteTicket } = require('../controllers/ticket');
// const { validateTicket } = require('../middleware/validation'); 
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/create/ticket/{eventId}:
 *   post:
 *     summary: Create a ticket for a specific event
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to purchase a ticket for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hasCar
 *             properties:
 *               hasCar:
 *                 type: string
 *                 enum: [yes, no]
 *                 description: Indicates whether the attendee has a car for parking access
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
 *                   example: Ticket created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     seat:
 *                       type: string
 *                       example: Table 3 Seat 2
 *                     checkInCode:
 *                       type: string
 *                       example: AB12C
 *                     carAccess:
 *                       type: string
 *                       example: yes
 *       400:
 *         description: Ticket purchase limit reached
 *       403:
 *         description: Ticket creation not allowed due to plan restrictions
 *       404:
 *         description: Event or event planner not found
 *       500:
 *         description: Internal server error
 */
router.post('/create/ticket/:eventId',createTicket);
// router.post('/create/ticket/:eventId', validateTicket, createTicket);

/**
 * @swagger
 * /api/v1/getOneTicket/{ticketId}:
 *   get:
 *     summary: Retrieve a single ticket by its ID
 *     tags: [Ticket]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ticket to retrieve
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.get('/getOneTicket',getOneTicketById)

/**
 * @swagger
 * /api/v1/tickets/{eventId}:
 *   get:
 *     summary: Get all tickets for a specific event
 *     tags: [Ticket]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tickets retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: No tickets found for this event
 *       500:
 *         description: Internal server error
 */
router.get('/tickets/:eventId', getAllTickets);

/**
 * @swagger
 * /api/v1/ticket/{ticketId}:
 *   delete:
 *     summary: Delete a specific ticket
 *     tags: [Ticket]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket deleted successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.delete('/ticket/:ticketId', deleteTicket);

module.exports = router;
