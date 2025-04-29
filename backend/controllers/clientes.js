const Cliente = require('../models/Cliente');

const crearCliente = async (req, res) => {
    try {
        const { tarjetas, ...clienteData } = req.body;

        if (tarjetas && tarjetas.length > 0) {
            tarjetas.forEach(tarjeta => {
                if (!tarjeta.numero || !tarjeta.tipo || !tarjeta.vencimiento || !tarjeta.titular || !tarjeta.codigoSeguridad) {
                    throw new Error('Todas las tarjetas deben tener número, tipo, vencimiento, titular y código de seguridad.');
                }
            });
        }

        const cliente = new Cliente(clienteData);

        if (tarjetas) {
            cliente.tarjetas = tarjetas;
        }

        await cliente.save();

        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const listarClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
};

const editarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { tarjetas, ...clienteData } = req.body;

        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        Object.assign(cliente, clienteData);

        if (tarjetas) {
            tarjetas.forEach(tarjeta => {
                if (!tarjeta.numero || !tarjeta.tipo || !tarjeta.vencimiento || !tarjeta.titular || !tarjeta.codigoSeguridad) {
                    throw new Error('Todas las tarjetas deben tener número, tipo, vencimiento, titular y código de seguridad.');
                }
            });

            cliente.tarjetas = tarjetas;
        }

        await cliente.save();

        res.status(200).json(cliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const eliminarTarjeta = async (req, res) => {
    try {
        const { id, tarjetaId } = req.params;

        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        const tarjetaIndex = cliente.tarjetas.findIndex(tarjeta => tarjeta._id.toString() === tarjetaId);

        if (tarjetaIndex === -1) {
            return res.status(404).json({ error: 'Tarjeta no encontrada' });
        }

        cliente.tarjetas.splice(tarjetaIndex, 1);
        await cliente.save();

        res.status(200).json({ mensaje: 'Tarjeta eliminada con éxito', cliente });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { crearCliente, listarClientes, editarCliente, eliminarTarjeta };
