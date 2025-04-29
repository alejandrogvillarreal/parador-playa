const express = require('express');
const router = express.Router();
const {
    crearCliente,
    listarClientes,
    editarCliente,
    eliminarTarjeta
} = require('../controllers/clientes');

router.post('/', crearCliente);
router.get('/', listarClientes);
router.put('/:id', editarCliente);
router.delete('/:id/tarjetas/:tarjetaId', eliminarTarjeta);

module.exports = router;
