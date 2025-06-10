export default function ReservaMiniCard({ reserva, estadoLabel }) {
  const primerProducto = reserva.productos[0];
  console.log("primerProducto", primerProducto)

  return (
    <div className="bg-white p-4 rounded shadow flex items-center gap-4">
      <img
        src={primerProducto?.imagen}
        alt={primerProducto?.nombre}
        className="w-16 h-16 object-cover rounded"
      />

      <div className="flex-1">
        <p className="text-sm font-semibold">
          {reserva.productos.map((p) => p.nombre).join(", ")}
        </p>
        <p className="text-sm text-gray-600">
          {new Date(reserva.fecha).toLocaleString("es-AR")}
        </p>
      </div>

      <span className="text-sm font-medium">
        {estadoLabel[reserva.estado] || reserva.estado}
      </span>
    </div>
  );
}
