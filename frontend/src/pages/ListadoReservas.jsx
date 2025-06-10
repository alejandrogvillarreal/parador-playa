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
      setReservas(data);
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-blue-800">Mis Reservas</h2>

      {loading && <p className="text-gray-500">Cargando reservas...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && reservas.length === 0 && (
        <p className="text-gray-600">No tenés reservas realizadas.</p>
      )}

      <div className="flex flex-wrap gap-6 justify-center">
        {reservas.map((reserva) => {
          const primerProducto = reserva.productos[0];
          return (
            <ReservaCard
              key={reserva.id}
              // nombre={primerProducto?.producto?.nombre || "Producto"}
              nombre={reserva.productos.map((p) => p.nombre).join(", ")}
              fecha={new Date(reserva.fecha).toLocaleString("es-AR")}
              estado={reserva.estado}
              imagen={primerProducto.imagen}
              // casco={primerProducto?.dispositivosExtra?.casco || 0}
              // chaleco={primerProducto?.dispositivosExtra?.chaleco || 0}
              reembolso={reserva.reembolsoPorTormenta}
              onCancelar={() => handleCancelar(reserva.id)}
              onPagar={() => setReservaSeleccionada(reserva)}
              onTormenta={() => handleReembolso(reserva.id)}
            />
          );
        })}
      </div>

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
