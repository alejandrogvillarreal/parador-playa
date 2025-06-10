const Reserva = require('../models/Reserva');
const Producto = require('../models/Producto');
const transformarReservaDTO = require('../utils/transformarReservaDTO');

const MAX_TURNOS = 3;
const MAX_ANTICIPACION_HS = 48;
const PRECIO_CASCO = 5;
const PRECIO_CHALECO = 8;

const crearReserva = async (req, res) => {
    try {
        const {
            cliente,
            productos,
            fechaHora,
            metodoPago,
            moneda
        } = req.body;

        const ahora = new Date();
        const fechaTurno = new Date(fechaHora);
        const diferenciaHoras = (fechaTurno - ahora) / 1000 / 60 / 60;

        // Validaciones de tiempo
        if (diferenciaHoras > MAX_ANTICIPACION_HS) {
            return res.status(400).json({ error: 'No se pueden reservar turnos con más de 48 horas de anticipación.' });
        }

        if (fechaTurno.getTime() < ahora.getTime()) {
            return res.status(400).json({ error: 'No se pueden reservar turnos en el pasado.' });
        }

        let total = 0;
        const aplicaDescuento = productos.length > 1;
        const productosProcesados = [];
        let totalTurnos = 0;

        for (const item of productos) {
            const productoBD = await Producto.findById(item.producto);

            if (!productoBD) {
                return res.status(404).json({ error: `Producto con ID ${item.producto} no encontrado.` });
            }

            const { personas, turnos } = item;

            // Validación de cantidad de personas según el producto
            if (personas < 1 || personas > productoBD.cantidadPersonasMax) {
                return res.status(400).json({
                    error: `El producto "${productoBD.nombre}" permite como máximo ${productoBD.cantidadPersonasMax} persona(s).`
                });
            }

            if (turnos < 1 || turnos > MAX_TURNOS) {
                return res.status(400).json({ error: 'La cantidad de turnos debe ser entre 1 y 3.' });
            }

            totalTurnos += turnos;
            if (totalTurnos > MAX_TURNOS) {
                return res.status(400).json({ error: 'El máximo de turnos por cliente es 3.' });
            }

            // Validar disponibilidad del producto
            const inicio = new Date(fechaHora);
            const fin = new Date(inicio.getTime() + turnos * 30 * 60 * 1000);

            const reservasExistentes = await Reserva.find({
                'productos.producto': productoBD._id,
                estado: { $in: ['pendiente', 'pagado'] },
                fechaHora: {
                    $lt: fin,
                    $gte: new Date(inicio.getTime() - (MAX_TURNOS * 30 * 60 * 1000))
                }
            });

            for (const r of reservasExistentes) {
                const rInicio = new Date(r.fechaHora);
                for (const p of r.productos) {
                    if (p.producto.toString() === productoBD._id.toString()) {
                        const rFin = new Date(rInicio.getTime() + p.turnos * 30 * 60 * 1000);
                        if (inicio < rFin && fin > rInicio) {
                            return res.status(400).json({
                                error: `El producto "${productoBD.nombre}" ya está reservado entre ${rInicio.toLocaleTimeString()} y ${rFin.toLocaleTimeString()}`
                            });
                        }
                    }
                }
            }

            const precioBase = productoBD.precio * turnos;

            const casco = productoBD.requiereCasco ? personas : 0;
            const chaleco = productoBD.requiereChaleco ? personas : 0;

            const precioCascos = casco * PRECIO_CASCO;
            const precioChalecos = chaleco * PRECIO_CHALECO;
            const precioDispositivos = precioCascos + precioChalecos;

            total += precioBase + precioDispositivos;

            productosProcesados.push({
                producto: productoBD._id,
                personas,
                turnos,
                dispositivosExtra: { casco, chaleco },
                precioBase,
                precioDispositivos
            });
        }

        if (aplicaDescuento) total *= 0.9;

        const nuevaReserva = new Reserva({
            cliente,
            productos: productosProcesados,
            fechaHora,
            metodoPago,
            moneda,
            estado: metodoPago === 'efectivo' ? 'pendiente' : 'pagado',
            descuentoAplicado: aplicaDescuento,
            montoTotal: total,
            reembolsoPorTormenta: false
        });

        await nuevaReserva.save();
        await nuevaReserva.populate('cliente');
        await nuevaReserva.populate('productos.producto');
        return res.status(201).json(transformarReservaDTO(nuevaReserva));

    } catch (error) {
        console.error('Error al crear reserva:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


const listarReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find()
            .populate('cliente')
            .populate('productos.producto');

        const reservasDTO = reservas.map(transformarReservaDTO);
        res.json(reservasDTO);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
};

const obtenerReservaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await Reserva.findById(id)
            .populate('cliente')
            .populate('productos.producto');

        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

        const reservaDTO = transformarReservaDTO(reserva);
        res.json(reservaDTO);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
}

const obtenerReservasPorCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;

        const reservas = await Reserva.find({ cliente: clienteId })
            .populate('productos.producto')
            .populate('cliente');

        const reservasDTO = reservas.map(transformarReservaDTO);
        return res.status(200).json(reservasDTO);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

const cancelarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await Reserva.findById(id);

        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

        const ahora = new Date();
        const fechaReserva = new Date(reserva.fechaHora);
        const diferenciaHoras = (fechaReserva - ahora) / (1000 * 60 * 60);

        if (diferenciaHoras < 2) {
            return res.status(400).json({ error: 'Solo se puede cancelar con más de 2 hs de anticipación' });
        }

        reserva.estado = 'cancelado';
        await reserva.save();
        await reserva.populate('cliente');
        await reserva.populate('productos.producto');
        res.status(200).json({ mensaje: 'Reserva cancelada con éxito', reserva: transformarReservaDTO(reserva) });

    } catch (error) {
        res.status(500).json({ error: 'Error al cancelar la reserva' });
    }
};

const pagarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await Reserva.findById(id);

        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

        const ahora = new Date();
        const fechaReserva = new Date(reserva.fechaHora);
        const diferenciaHoras = (fechaReserva - ahora) / (1000 * 60 * 60);

        if (reserva.metodoPago === 'efectivo' && diferenciaHoras < 2) {
            return res.status(400).json({ error: 'El pago en efectivo debe hacerse al menos 2 hs antes' });
        }

        reserva.estado = 'pagado';
        await reserva.save();
        await reserva.populate('cliente');
        await reserva.populate('productos.producto');
        res.status(200).json({ mensaje: 'Reserva pagada con éxito', reserva: transformarReservaDTO(reserva) });

    } catch (error) {
        res.status(500).json({ error: 'Error al procesar el pago' });
    }
};

const reembolsarPorTormenta = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await Reserva.findById(id);

        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });
        if (reserva.reembolsoPorTormenta) {
            return res.status(400).json({ error: 'El reembolso ya fue aplicado' });
        }

        reserva.reembolsoPorTormenta = true;
        reserva.montoTotal = reserva.montoTotal / 2;
        await reserva.save();
        await reserva.populate('cliente');
        await reserva.populate('productos.producto');
        res.status(200).json({ mensaje: 'Reserva reembolsada con éxito', reserva: transformarReservaDTO(reserva) });

    } catch (error) {
        res.status(500).json({ error: 'Error al aplicar reembolso', detalle: error.message });
    }
};

const liberarReservasNoPagadas = async (req, res) => {
    try {
        const dosHorasDespues = new Date(Date.now() + 2 * 60 * 60 * 1000);
        const ahora = new Date();
        const reservas = await Reserva.find({
            metodoPago: 'efectivo',
            estado: 'pendiente',
            fechaHora: { $gte: ahora, $lte: dosHorasDespues }
        });

        let liberadas = 0;

        for (let reserva of reservas) {
            reserva.estado = 'liberado';
            await reserva.save();
            liberadas++;
        }

        return res.status(200).json({
            mensaje: `${liberadas} reservas liberadas por falta de pago en efectivo.`,
        });

    } catch (error) {
        console.error('Error al liberar reservas:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


module.exports = { crearReserva, listarReservas, obtenerReservaPorId, cancelarReserva, pagarReserva, reembolsarPorTormenta, obtenerReservasPorCliente, liberarReservasNoPagadas };
