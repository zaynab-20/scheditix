const { initializePayment, verifyPayment } = require('../controllers/payment');
const router = require('express').Router();

/**
 * @swagger
 * /payment/{ticketId}:
 *   post:
 *     summary: Initialize payment for ticket purchase
 *     description: This endpoint allows an attendee to initialize a payment for a ticket purchase.
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         description: ID of the ticket to purchase
 *         required: true
 *         type: string
 *       - in: body
 *         name: paymentDetails
 *         description: Payment details for the attendee
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - attendeeName
 *             - attendeeEmail
 *           properties:
 *             attendeeName:
 *               type: string
 *               example: "John Doe"
 *             attendeeEmail:
 *               type: string
 *               example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Payment initialize Successful"
 *             data:
 *               type: object
 *               properties:
 *                 reference:
 *                   type: string
 *                   example: "123ABC456XYZ"
 *                 checkout_url:
 *                   type: string
 *                   example: "https://korapay.com/checkout/123ABC456XYZ"
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/payment/:ticketId', initializePayment);

/**
 * @swagger
 * /verify:
 *   get:
 *     summary: Verify payment status
 *     description: This endpoint allows verification of payment status using the reference ID.
 *     parameters:
 *       - in: query
 *         name: reference
 *         description: Reference ID of the payment to verify
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Payment verification successful
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Payment successful"
 *       400:
 *         description: Reference is required or Transaction not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/verify', verifyPayment);

module.exports = router;
