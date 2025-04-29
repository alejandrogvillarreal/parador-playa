const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },

    productos: [{
        producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
        personas: { type: Number, enum: [1, 2], required: true },
        turnos: { type: Number, required: true, min: 1, max: 3 },
        dispositivosExtra: {
            casco: { type: Number, default: 0 },
            chaleco: { type: Number, default: 0 }
        },
        precioBase: { type: Number, required: true },
        precioDispositivos: { type: Number, default: 0 }
    }],

    fechaHora: { type: Date, required: true },

    metodoPago: {
        type: String,
        enum: ['efectivo', 'tarjeta'],
        required: true
    },
    moneda: {
        type: String,
        enum: ['local', 'extranjera'],
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'pagado', 'cancelado', 'liberado'],
        default: 'pendiente'
    },
    descuentoAplicado: { type: Boolean, default: false },
    montoTotal: { type: Number, required: true },
    reembolsoPorTormenta: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reserva', reservaSchema);
