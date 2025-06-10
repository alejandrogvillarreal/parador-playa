export default function ProductoSelectorCard({
  producto,
  turnosSeleccionados,
  personasSeleccionadas,
  maxTurnosPermitidos,
  onCambiarProducto,
}) {
  const handleTurnosChange = (e) => {
    let turnos = parseInt(e.target.value);
    if (isNaN(turnos) || turnos < 0) turnos = 0;
    if (turnos > maxTurnosPermitidos) turnos = maxTurnosPermitidos;
    onCambiarProducto(producto._id, turnos, personasSeleccionadas);
  };

  const handlePersonasChange = (e) => {
    let personas = parseInt(e.target.value);
    if (isNaN(personas) || personas < 1) personas = 1;
    if (personas > producto.cantidadPersonasMax) personas = producto.cantidadPersonasMax;
    onCambiarProducto(producto._id, turnosSeleccionados, personas);
  };

  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-xl shadow border border-gray-200 overflow-hidden h-[220px]">
      <img
        src={producto.imagen}
        alt={`Imagen de ${producto.nombre}`}
        className="w-full sm:w-32 h-40 sm:h-full object-cover"
        loading="lazy"
      />
      <div className="flex flex-col justify-between p-4 flex-1">
        <div>
          <h3 className="text-lg font-semibold">{producto.nombre}</h3>
          <p className="text-gray-600 text-sm mb-2">{producto.descripcion}</p>
          <p className="text-sm font-medium">Precio por turno: ${producto.precio}</p>

          {(producto.requiereCasco || producto.requiereChaleco) && (
            <div className="mt-2 flex gap-2 text-sm text-gray-700 flex-wrap">
              {producto.requiereCasco && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  🪖 Requiere casco
                </span>
              )}
              {producto.requiereChaleco && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  🦺 Requiere chaleco
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor={`turnos-${producto._id}`} className="text-sm font-medium">
              Turnos:
            </label>
            <input
              id={`turnos-${producto._id}`}
              type="number"
              min="0"
              max={maxTurnosPermitidos}
              value={turnosSeleccionados}
              onChange={handleTurnosChange}
              disabled={maxTurnosPermitidos === 0}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
            />
            <span className="text-sm text-gray-500">(Máx. {maxTurnosPermitidos})</span>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor={`personas-${producto._id}`} className="text-sm font-medium">
              Personas:
            </label>
            <input
              id={`personas-${producto._id}`}
              type="number"
              min="1"
              max={producto.cantidadPersonasMax}
              value={personasSeleccionadas}
              onChange={handlePersonasChange}
              disabled={producto.cantidadPersonasMax === 1}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
            />
            <span className="text-sm text-gray-500">
              (Máx. {producto.cantidadPersonasMax})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
