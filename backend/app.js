const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const productosRoutes = require('./routes/productos');
const clientesRoutes = require('./routes/clientes');
const reservasRoutes = require('./routes/reservas');

app.use(cors());
app.use(express.json());

app.use('/productos', productosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/reservas', reservasRoutes);

app.get('/', (req, res) => {
    res.send('API del Parador funcionando 🚤');
});

module.exports = app;
