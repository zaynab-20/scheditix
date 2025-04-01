const { initializePayment, verifyPayment } = require('../controllers/payment');

const router = require('express').Router();

router.post('/payment/:ticketId', initializePayment);
router.get('/verify', verifyPayment);

module.exports = router;