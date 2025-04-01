const { createTicket,getAllTickets,getTicketById,updateTicket,deleteTicket} = require('../controllers/ticket');

const router = require('express').Router();

router.post('/create/ticket/:eventId', createTicket);

router.get('/tickets/:eventId', getAllTickets);

router.get('/ticket/:ticketId', getTicketById);

router.put('/ticket/:ticketId', updateTicket);

router.delete('/ticket/:ticketId', deleteTicket);

module.exports = router;