import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReservasByCliente } from "../services/reservaService";


export default function Dashboard() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const clienteId = localStorage.getItem("clienteId");
    if (!clienteId) return;

    const cargarReservas = async () => {
      try {
        const data = await getReservasByCliente(clienteId);
        setReservas(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las reservas.");
      } finally {
        setLoading(false);
      }
    };

    cargarReservas();
  }, []);


  const resumen = {
    activas: reservas.filter((r) => r.estado === "pendiente" || r.estado === "pagado"),
    historial: reservas.filter((r) => r.estado === "cancelado" || r.estado === "liberado"),
  };

  const estadoLabel = {
    pendiente: "⏳ Pendiente",
    pagado: "✅ Pagado",
    cancelado: "❌ Cancelada",
    liberado: "🕓 Liberada",
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Mi Actividad</h1>

      {loading && <p className="text-gray-600">Cargando tus reservas...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && (
        <>
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="bg-white p-4 rounded shadow w-full sm:w-60">
              <h3 className="font-bold text-gray-700">Reservas activas</h3>
              <p className="text-2xl text-blue-600">{resumen.activas.length}</p>
            </div>
            <div className="bg-white p-4 rounded shadow w-full sm:w-60">
              <h3 className="font-bold text-gray-700">En historial</h3>
              <p className="text-2xl text-gray-600">{resumen.historial.length}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Últimas reservas</h2>
            <button
              onClick={() => navigate("/reservas")}
              className="text-sm text-blue-600 hover:underline"
            >
              Ver todas
            </button>
          </div>

          {reservas.length === 0 && (
            <p className="text-gray-600">Aún no realizaste ninguna reserva.</p>
          )}

          <ul className="space-y-3">
            {reservas
              .slice(0, 3)
              .map((reserva) => (
                <li
                  key={reserva._id}
                  className="bg-white p-4 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {reserva.productos.map((p) => p.producto?.nombre).join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(reserva.fechaHora).toLocaleString("es-AR")}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    {estadoLabel[reserva.estado] || reserva.estado}
                  </span>
                </li>
              ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/reserva")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Nueva reserva
            </button>
            <button
              onClick={() => navigate("/reservas")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Ver historial
            </button>
          </div>
        </>
      )}
    </div>
  );
}
