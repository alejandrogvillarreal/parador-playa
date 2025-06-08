export default function ProductoSelectorCard({
  producto,
  turnosSeleccionados,
  onCambiarTurnos,
}) {
  const handleChange = (e) => {
    const cantidad = parseInt(e.target.value);
    if (isNaN(cantidad) || cantidad <= 0) {
      onCambiarTurnos(producto._id, 0); // eliminar si 0
    } else {
      onCambiarTurnos(producto._id, cantidad);
    }
  };

  return (
    <div className="flex bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="w-32 h-full object-cover"
      />
      <div className="flex flex-col justify-between p-4 flex-1">
        <div>
          <h3 className="text-lg font-semibold">{producto.nombre}</h3>
          <p className="text-gray-600 text-sm mb-2">{producto.descripcion}</p>
          <p className="text-sm font-medium">Precio por turno: ${producto.precio}</p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <label htmlFor={`turnos-${producto._id}`} className="text-sm font-medium">
            Turnos:
          </label>
          <input
            id={`turnos-${producto._id}`}
            type="number"
            min="0"
            max="3"
            value={turnosSeleccionados}
            onChange={handleChange}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <span className="text-sm text-gray-500">(Máx. 3)</span>
        </div>
      </div>
    </div>
  );
}
