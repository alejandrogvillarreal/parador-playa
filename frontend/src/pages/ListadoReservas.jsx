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

  // const navigate = useNavigate();

  useEffect(() => {
    const clienteId = localStorage.getItem("clienteId");
    if (!clienteId) {
      setError("Cliente no identificado");
      setLoading(false);
      return;
    }

    const cargarReservas = async () => {
      try {
        const data = await getReservasByCliente(clienteId);
        setReservas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarReservas();
  }, []);

  const handleCancelar = async (id) => {
    try {
      await cancelarReserva(id);
      alert("Reserva cancelada con éxito");
      setReservas((prev) =>
        prev.map((r) => (r._id === id ? { ...r, estado: "cancelado" } : r))
      );
    } catch (err) {
      alert("Error al cancelar: " + err.message);
    }
  };

  const handleConfirmarPago = async () => {
    try {
      await pagarReserva(reservaSeleccionada._id);
      alert("Reserva pagada con éxito");
      setReservas((prev) =>
        prev.map((r) =>
          r._id === reservaSeleccionada._id ? { ...r, estado: "pagado" } : r
        )
      );
      setReservaSeleccionada(null);
    } catch (err) {
      alert("Error al pagar: " + err.message);
    }
  };


  const handleReembolso = async (id) => {
    try {
      await reembolsarPorTormenta(id);
      alert("Reembolso aplicado con éxito");
      setReservas((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, reembolsoPorTormenta: true, montoTotal: r.montoTotal / 2 } : r
        )
      );
    } catch (err) {
      alert("Error al aplicar reembolso: " + err.message);
    }
  };

  const obtenerImagenPorTipo = (tipo) => {
    const imagenes = {
      jetsky: "https://images.unsplash.com/photo-1564633351631-e85bd59a91af?w=600",
      cuatriciclo: "https://images.unsplash.com/photo-1489731254138-5401fb834d9c?q=80",
      buceo: "https://images.unsplash.com/photo-1544551763-8dd44758c2dd?q=80",
      "tabla surf adulto": "https://images.unsplash.com/photo-1551524358-f34c0214781d?q=80",
      "tabla surf niño": "https://plus.unsplash.com/premium_photo-1684517009001-0d3a715dfd91?q=80",
    };
    return imagenes[tipo] || "https://via.placeholder.com/150";
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
          const prod = reserva.productos[0];
          return (
            <ReservaCard
              key={reserva._id}
              nombre={prod?.producto?.nombre || "Producto"}
              fecha={new Date(reserva.fechaHora).toLocaleString("es-AR")}
              estado={reserva.estado}
              imagen={obtenerImagenPorTipo(prod?.producto?.tipo)}
              casco={prod?.dispositivosExtra?.casco || 0}
              chaleco={prod?.dispositivosExtra?.chaleco || 0}
              reembolso={reserva.reembolsoPorTormenta}
              onCancelar={() => handleCancelar(reserva._id)}
              onPagar={() => setReservaSeleccionada(reserva)}
              onTormenta={() => handleReembolso(reserva._id)}
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
