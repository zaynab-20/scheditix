const { createTicket, getAllTickets, getOneTicketById,deleteTicket, updateTicket } = require('../controllers/ticket');
const { validateTicketPurchase } = require('../middleware/validation'); 
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
 *               - fullName
 *               - email
 *               - numberOfTicket
 *               - needCarPackingSpace
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               numberOfTicket:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3
 *                 example: 2
 *               needCarPackingSpace:
 *                 type: string
 *                 enum: [yes, no]
 *                 example: yes
 *                 description: Indicates whether the attendee needs car parking access
 *               specialRequest:
 *                 type: string
 *                 example: I’d like a seat close to the stage
 *                 description: Optional special requests for seating, accessibility, etc.
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
 *                       example: Table 1 Seat 1
 *                     checkInCode:
 *                       type: string
 *                       example: A1B2C
 *                     numberOfTicket:
 *                       type: integer
 *                       example: 2
 *                     carAccess:
 *                       type: string
 *                       example: yes
 *                     specialRequest:
 *                       type: string
 *                       example: I’d like a seat close to the stage
 *       400:
 *         description: Ticket purchase limit reached
 *       403:
 *         description: Ticket creation not allowed due to plan restrictions
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.post('/create/ticket/:eventId',validateTicketPurchase,createTicket)

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
 * /api/v1/update/ticket/{ticketId}:
 *   put:
 *     summary: Update a ticket by ID
 *     tags: [Ticket]
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
 *               fullName:
 *                 type: string
 *                 example: Jane Smith
 *               email:
 *                 type: string
 *                 example: janesmith@example.com
 *               numberOfTicket:
 *                 type: integer
 *                 example: 2
 *               needCarPackingSpace:
 *                 type: string
 *                 enum: [yes, no]
 *                 example: no
 *               specialRequest:
 *                 type: string
 *                 example: Please provide a seat near the exit
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
 *                   example: Ticket updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 661fb9e3f1a3cc152efde9e2
 *                     eventId:
 *                       type: string
 *                       example: 661fb9c9f1a3cc152efde9d1
 *                     fullName:
 *                       type: string
 *                       example: Jane Smith
 *                     email:
 *                       type: string
 *                       example: janesmith@example.com
 *                     numberOfTicket:
 *                       type: integer
 *                       example: 2
 *                     carAccess:
 *                       type: string
 *                       example: no
 *                     specialRequest:
 *                       type: string
 *                       example: Please provide a seat near the exit
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.put('/update/ticket/:ticketId',validateTicketPurchase,updateTicket);

/**
 * @swagger
 * /api/v1/ticket/{ticketId}:
 *   delete:
 *     summary: Delete a ticket by ID
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket not found
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
 *                   example: Some error message
 */
router.delete('/ticket/:ticketId', deleteTicket);

module.exports = router;
