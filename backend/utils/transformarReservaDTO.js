const transformarReservaDTO = (reserva) => {
    return {
        id: reserva._id,
        cliente: {
            nombre: reserva.cliente.nombre,
            apellido: reserva.cliente.apellido,
            email: reserva.cliente.email
        },
        fecha: reserva.fechaHora,
        estado: reserva.estado,
        metodoPago: reserva.metodoPago,
        moneda: reserva.moneda,
        descuentoAplicado: reserva.descuentoAplicado,
        reembolsoPorTormenta: reserva.reembolsoPorTormenta,
        montoTotal: reserva.montoTotal,
        productos: reserva.productos.map(p => ({
            nombre: p.producto.nombre,
            tipo: p.producto.tipo,
            personas: p.personas,
            turnos: p.turnos,
            precioBase: p.precioBase,
            precioDispositivos: p.precioDispositivos,
            dispositivosExtra: p.dispositivosExtra
        }))
    };
};

module.exports = transformarReservaDTO;
