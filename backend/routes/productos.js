const express = require('express');
const router = express.Router();
const {
    crearProducto,
    listarProductos,
    obtenerProducto
} = require('../controllers/productos');

router.post('/', crearProducto);
router.get('/:id', obtenerProducto);
router.get('/', listarProductos);

module.exports = router;
