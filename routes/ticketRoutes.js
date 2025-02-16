const express = require('express');

// Importação dos middlewares de autenticação
const { verifyToken, isAdm } = require('../middleware/auth.js');
const router = express.Router();

// Importação do controlador de tickets
const ticketsController = require('../controller/ticketsController.js');

// Rotas GET
router.get('', verifyToken, ticketsController.getTickets);
router.get('/types/:name', verifyToken, ticketsController.getTicketByName);
router.get('/price/:price', verifyToken, ticketsController.getTicketsByPrice);

// Rotas POST
router.post('/registerTicket', verifyToken, isAdm, ticketsController.registerTicket);
router.post('/buyTicket', verifyToken, ticketsController.buyTicket);

// Rota PUT
router.put('/updateTicket', verifyToken, isAdm, ticketsController.updateTicket);

// Rota DELETE
router.delete('/deleteTicket/:id', verifyToken, isAdm, ticketsController.deleteTicket);

module.exports = router;