export default function ProductCard({
  nombre,
  descripcion,
  imagen,
  onClick,
  precio,
  maxPersonas
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md w-full max-w-sm transition hover:shadow-lg">
      <img
        src={imagen}
        alt={`Imagen de ${nombre}`}
        loading="lazy"
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-5 flex flex-col justify-between h-full">
        <div>
          <h5 className="mb-2 text-2xl font-bold text-gray-900">{nombre}</h5>
          <p className="text-sm text-gray-600 mb-1">{descripcion}</p>
          {precio && (
            <p className="text-sm text-gray-700">
              <strong>Precio:</strong> ${precio}
            </p>
          )}
          {maxPersonas && (
            <p className="text-sm text-gray-700">
              <strong>Máx personas:</strong> {maxPersonas}
            </p>
          )}
        </div>
        <button
          onClick={onClick}
          className="mt-4 w-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Reservar
        </button>
      </div>
    </div>
  );
}
