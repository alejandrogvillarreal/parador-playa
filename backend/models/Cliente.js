const mongoose = require('mongoose');

const tarjetaSchema = new mongoose.Schema({
    numero: { type: String, required: true },
    tipo: { type: String, enum: ['visa', 'mastercard', 'american-express', 'otro'], required: true },
    vencimiento: { type: Date, required: true },
    titular: { type: String, required: true },
    codigoSeguridad: { type: String, required: true },
});

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true },
    documento: { type: String, required: true, unique: true },
    tarjetas: [tarjetaSchema],
});

module.exports = mongoose.model('Cliente', clienteSchema);