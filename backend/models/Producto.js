const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, enum: ['jetsky', 'cuatriciclo', 'buceo', 'tabla surf niño', 'tabla surf adulto'], required: true },
  precio: { type: Number, required: true },
  requiereCasco: { type: Boolean, default: false },
  requiereChaleco: { type: Boolean, default: false },
  cantidadPersonasMax: { type: Number, default: 1 }
});

module.exports = mongoose.model('Producto', productoSchema);
