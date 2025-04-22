const { initializePayment, verifyPayment } = require('../controllers/payment');
const router = require('express').Router();

/**
 * @swagger
 * /api/v1/payment/{ticketId}:
 *   post:
 *     summary: Initialize payment for a ticket
 *     description: Starts a new payment session for a given ticket.
 *     tags:
 *       - Payment
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attendeeName
 *               - attendeeEmail
 *             properties:
 *               attendeeName:
 *                 type: string
 *                 example: John Doe
 *               attendeeEmail:
 *                 type: string
 *                 format: email
 *                 example: johndoe@gmail.com
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *       404:
 *         description: Ticket not found
 *       400:
 *         description: All tickets sold out
 *       500:
 *         description: Error initializing payment
 */

router.post('/payment/:ticketId', initializePayment);

/**
 * @swagger
 * /api/v1/verify:
 *   get:
 *     summary: Verify payment transaction
 *     description: Verifies the status of a payment transaction using the reference code.
 *     tags:
 *       - Payment
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction reference code
 *     responses:
 *       200:
 *         description: Payment successful
 *       400:
 *         description: Reference missing or transaction not found
 *       500:
 *         description: Error verifying payment
 */
router.get('/verify', verifyPayment);

module.exports = router;
