import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import ReservaCard from "../components/ReservaCard";
import ModalPago from "../components/ModalPago";
import {
  getReservasByCliente,
  cancelarReserva,
  pagarReserva,
  reembolsarPorTormenta,
} from "../services/reservaService";

export default function ListadoReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  const cargarReservas = async () => {
    const clienteId = localStorage.getItem("clienteId");
    if (!clienteId) {
      setError("Cliente no identificado");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getReservasByCliente(clienteId);
      setReservas(data.reverse());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

const handleCancelar = async (id) => {
    try {
      await cancelarReserva(id);
      alert("Reserva cancelada con éxito");
      await cargarReservas(); // recarga desde backend
    } catch (err) {
      alert("Error al cancelar: " + err.message);
    }
  };

  const handleConfirmarPago = async () => {
    try {
      const { id, metodoPago, moneda } = reservaSeleccionada;
      await pagarReserva(id, metodoPago, moneda);
      alert("Reserva pagada con éxito");
      setReservaSeleccionada(null);
      await cargarReservas();
    } catch (err) {
      alert("Error al pagar: " + err.message);
    }
  };

  const handleReembolso = async (id) => {
    try {
      await reembolsarPorTormenta(id);
      alert("Reembolso aplicado con éxito");
      await cargarReservas(); // recarga después del reembolso
    } catch (err) {
      alert("Error al aplicar reembolso: " + err.message);
    }
  };

  const ahora = new Date();

  const futuras = reservas.filter(
    (r) => (r.estado === "pendiente" || r.estado === "pagado") && new Date(r.fecha) > ahora
  );

  const pasadas = reservas.filter(
    (r) => r.estado === "pagado" && new Date(r.fecha) <= ahora
  );

  const historial = reservas.filter(
    (r) => r.estado === "cancelado" || r.estado === "liberado"
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-blue-800">Mis Reservas</h2>

      {loading && <p className="text-gray-500">Cargando reservas...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && reservas.length === 0 && (
        <p className="text-gray-600">No tenés reservas realizadas.</p>
      )}

        {futuras.length > 0 && (
        <>
          <h3 className="text-xl text-center font-semibold text-blue-700 mb-8">📅 Próximas reservas</h3>
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            {futuras.map((reserva) => (
              <ReservaCard
                key={reserva.id}
                nombre={reserva.productos.map((p) => p.nombre).join(", ")}
                fecha={new Date(reserva.fecha).toLocaleString("es-AR")}
                estado={reserva.estado}
                imagen={reserva.productos[0]?.imagen}
                casco={reserva.productos.reduce((acc, p) => acc + (p.dispositivosExtra?.casco || 0), 0)}
                chaleco={reserva.productos.reduce((acc, p) => acc + (p.dispositivosExtra?.chaleco || 0), 0)}
                reembolso={reserva.reembolsoPorTormenta}
                onCancelar={() => handleCancelar(reserva.id)}
                onPagar={() => setReservaSeleccionada(reserva)}
                onTormenta={() => handleReembolso(reserva.id)}
              />
            ))}
          </div>
        </>
      )}

      {pasadas.length > 0 && (
        <>
          <h3 className="text-xl text-center font-semibold text-gray-700 mb-8">🕓 Reservas finalizadas</h3>
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            {pasadas.map((reserva) => (
              <ReservaCard
                key={reserva.id}
                nombre={reserva.productos.map((p) => p.nombre).join(", ")}
                fecha={new Date(reserva.fecha).toLocaleString("es-AR")}
                estado="finalizada"
                imagen={reserva.productos[0]?.imagen}
                casco={reserva.productos.reduce((acc, p) => acc + (p.dispositivosExtra?.casco || 0), 0)}
                chaleco={reserva.productos.reduce((acc, p) => acc + (p.dispositivosExtra?.chaleco || 0), 0)}
                reembolso={reserva.reembolsoPorTormenta}
                onCancelar={() => {}}
                onPagar={() => {}}
                onTormenta={() => {}}
              />
            ))}
          </div>
        </>
      )}

      {historial.length > 0 && (
        <>
          <h3 className="text-xl text-center font-semibold text-gray-600 mb-8">📜 Canceladas / Liberadas</h3>
          <div className="flex flex-wrap gap-6 justify-center">
            {historial.map((reserva) => (
              <ReservaCard
                key={reserva.id}
                nombre={reserva.productos.map((p) => p.nombre).join(", ")}
                fecha={new Date(reserva.fecha).toLocaleString("es-AR")}
                estado={reserva.estado}
                imagen={reserva.productos[0]?.imagen}
                casco={reserva.productos.reduce((acc, p) => acc + (p.dispositivosExtra?.casco || 0), 0)}
                chaleco={reserva.productos.reduce((acc, p) => acc + (p.dispositivosExtra?.chaleco || 0), 0)}
                reembolso={reserva.reembolsoPorTormenta}
                onCancelar={() => {}}
                onPagar={() => {}}
                onTormenta={() => {}}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal de pago reutilizable */}
      <ModalPago
        visible={!!reservaSeleccionada}
        onCancelar={() => setReservaSeleccionada(null)}
        onConfirmar={handleConfirmarPago}
        montoTotal={reservaSeleccionada?.montoTotal}
        moneda={reservaSeleccionada?.moneda}
        metodoPago={reservaSeleccionada?.metodoPago}
        titulo="Confirmar pago de reserva"
        descripcion="Al confirmar se aplicará el pago de esta reserva pendiente."
      />
    </div>
  );
}
