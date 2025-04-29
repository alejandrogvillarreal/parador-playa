const Producto = require('../models/Producto');
const Reserva = require('../models/Reserva');

const crearProducto = async (req, res) => {
    try {
        const producto = new Producto(req.body);
        await producto.save();
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const listarProductos = async (req, res) => {
    const productos = await Producto.find().lean();
    const reservas = await Reserva.find({
        estado: { $in: ['pendiente', 'pagado'] } // solo reservas activas
    }).lean();

    const productosConReservas = productos.map(producto => {
        const reservasAsociadas = reservas.filter(reserva =>
            reserva.productos.some(p => p.producto.toString() === producto._id.toString())
        ).map(reserva => ({
            idReserva: reserva._id,
            fechaHora: reserva.fechaHora,
            estado: reserva.estado
        }));

        return {
            ...producto,
            reservas: reservasAsociadas
        };
    });

    res.json(productosConReservas);
};

const obtenerProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findById(id).lean();
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const reservas = await Reserva.find({
            estado: { $in: ['pendiente', 'pagado'] },
            'productos.producto': id
        }).lean();

        const reservasAsociadas = reservas.map(reserva => ({
            idReserva: reserva._id,
            fechaHora: reserva.fechaHora,
            estado: reserva.estado
        }));

        res.json({
            ...producto,
            reservas: reservasAsociadas
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { crearProducto, listarProductos, obtenerProducto };