export default function ReservaCard({
  nombre,
  fecha,
  estado,
  imagen,
  casco,
  chaleco,
  reembolso,
  onCancelar,
  onPagar,
  onTormenta,
}) {
  const estadoLabel = {
    pendiente: "⏳ Pendiente",
    pagado: "✅ Pagado",
    cancelado: "❌ Cancelada",
    liberado: "🕓 Liberada",
    finalizada: "🏁 Finalizada",
  };

  const estadoColor = {
    pendiente: "text-yellow-600",
    pagado: "text-green-600",
    cancelado: "text-red-600",
    liberado: "text-gray-500",
    finalizada: "text-blue-600"
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-sm">
      <img
        className="w-full h-48 object-cover rounded-t-lg"
        src={imagen}
        alt={`Imagen del producto ${nombre}`}
      />
      <div className="p-5">
        <h5 className="mb-1 text-xl font-bold text-gray-900">{nombre}</h5>

        <p className="text-gray-700 mb-1">
          <strong>Fecha:</strong> {fecha}
        </p>

        <p className={`mb-1 font-semibold ${estadoColor[estado] || "text-gray-600"}`}>
          Estado: {estadoLabel[estado] || estado}
        </p>

        {(casco > 0 || chaleco > 0) && (
          <p className="text-sm text-gray-600 mb-2">
            <strong>Dispositivos:</strong>{" "}
            {casco > 0 && `🪖 Casco x${casco} `}
            {chaleco > 0 && `🦺 Chaleco x${chaleco}`}
          </p>
        )}

        <div className="flex flex-col gap-2 mt-3">
          {estado === "pendiente" && (
            <div className="flex gap-2">
              <button
                onClick={onPagar}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                Pagar
              </button>
              <button
                onClick={onCancelar}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          )}

          {estado === "pagado" && (
            <>
              <span className="bg-green-100 text-green-800 text-center px-3 py-2 rounded-lg text-sm font-semibold">
                Ya pagada
              </span>
              {!reembolso ? (
                <button
                  onClick={onTormenta}
                  className="text-sm text-white bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg font-medium"
                >
                  Aplicar reembolso por tormenta
                </button>
              ) : (
                <span className="bg-purple-100 text-purple-800 text-center px-3 py-2 rounded-lg text-sm font-semibold">
                  Reembolsada por tormenta
                </span>
              )}
            </>
          )}

          {(estado === "cancelado" || estado === "liberado") && (
            <span className={`bg-gray-100 text-center px-3 py-2 rounded-lg text-sm font-medium ${estadoColor[estado]}`}>
              {estadoLabel[estado]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
