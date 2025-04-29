const express = require('express');
const router = express.Router();
const {
    crearReserva,
    listarReservas,
    obtenerReservaPorId,
    cancelarReserva,
    pagarReserva,
    reembolsarPorTormenta,
    obtenerReservasPorCliente,
    liberarReservasNoPagadas
} = require('../controllers/reservas');

router.post('/', crearReserva);
router.get('/', listarReservas);
router.get('/:id', obtenerReservaPorId);
router.put('/:id/cancelar', cancelarReserva);
router.put('/:id/pagar', pagarReserva);
router.put('/:id/tormenta', reembolsarPorTormenta);
router.get('/cliente/:clienteId', obtenerReservasPorCliente);
router.patch('/liberar/no-pagadas', liberarReservasNoPagadas);

module.exports = router;
