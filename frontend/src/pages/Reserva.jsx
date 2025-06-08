import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReserva } from "../services/reservaService";
import { getProductos } from "../services/productoService";
import ProductoSelectorCard from "../components/ProductoSelectorCard";
import ModalPago from "../components/ModalPago";

export default function ReservaPage() {
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [turnosTotales, setTurnosTotales] = useState(0);
  const [montoTotal, setMontoTotal] = useState(0);
  const [fechaHora, setFechaHora] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [moneda, setMoneda] = useState("local");
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    };

    cargarProductos();
  }, []);

  useEffect(() => {
    let total = 0;
    let totalTurnos = 0;

    productosSeleccionados.forEach((p) => {
      const productoInfo = productos.find((prod) => prod._id === p._id);
      if (productoInfo) {
        total += p.turnos * productoInfo.precio;
        totalTurnos += p.turnos;
      }
    });

    if (productosSeleccionados.length > 1) total *= 0.9;

    setTurnosTotales(totalTurnos);
    setMontoTotal(total);
  }, [productosSeleccionados, productos]);

  const handleProductoSelect = (productoId, nuevosTurnos) => {
    setProductosSeleccionados((prev) => {
      const existe = prev.find((p) => p._id === productoId);
      const nuevaLista = existe
        ? prev.map((p) =>
            p._id === productoId ? { ...p, turnos: nuevosTurnos } : p
          )
        : [...prev, { _id: productoId, turnos: nuevosTurnos }];

      // Si los turnos son 0, eliminar
      return nuevaLista.filter((p) => p.turnos > 0);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (productosSeleccionados.length === 0 || montoTotal <= 0) {
      alert("Seleccioná al menos un producto con turnos válidos.");
      return;
    }

    if (turnosTotales > 3) {
      alert("No podés seleccionar más de 3 turnos en total.");
      return;
    }

    if (new Date(fechaHora) < new Date()) {
      alert("La fecha debe ser en el futuro.");
      return;
    }

    setMostrarModalPago(true);
  };

  const crearReserva = async () => {
    try {
      const clienteId = localStorage.getItem("clienteId");
      if (!clienteId) {
        alert("No se encontró el cliente. Iniciá sesión nuevamente.");
        return;
      }

      const productosPayload = productosSeleccionados.map((p) => ({
        producto: p._id,
        personas: 2,
        turnos: p.turnos,
      }));

      const nuevaReserva = {
        cliente: clienteId,
        productos: productosPayload,
        fechaHora,
        metodoPago,
        moneda,
      };

      await createReserva(nuevaReserva);
      alert("Reserva creada exitosamente 🎉");
      navigate("/dashboard");
    } catch (err) {
      alert("Error al crear reserva: " + err.message);
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Formulario de Reserva</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Seleccioná los productos y la cantidad de turnos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((producto) => {
            const seleccionado = productosSeleccionados.find((p) => p._id === producto._id);
            const turnos = seleccionado?.turnos || 0;

            return (
              <ProductoSelectorCard
                key={producto._id}
                producto={producto}
                turnosSeleccionados={turnos}
                onCambiarTurnos={handleProductoSelect}
              />
            );
          })}
        </div>
      </div>

      {productosSeleccionados.length > 0 && (
        <>
          <p className="text-sm text-gray-600 mt-2">
            Turnos seleccionados: {turnosTotales} / 3
          </p>
          <div className="mb-8 mt-4">
            <h2 className="text-2xl font-semibold mb-4">Productos seleccionados</h2>
            <ul className="space-y-4">
              {productosSeleccionados.map((p) => {
                const productoInfo = productos.find((prod) => prod._id === p._id);
                return (
                  <li
                    key={p._id}
                    className="flex justify-between items-center bg-white p-4 rounded shadow"
                  >
                    <span>{productoInfo?.nombre}</span>
                    <span>{p.turnos} turnos</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Fecha y hora del alquiler
          </label>
          <input
            type="datetime-local"
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Método de Pago
          </label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Moneda
          </label>
          <select
            value={moneda}
            onChange={(e) => setMoneda(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          >
            <option value="local">Moneda Local</option>
            <option value="extranjera">Moneda Extranjera</option>
          </select>
        </div>

        <div className="mb-4">
          <p className="font-semibold text-lg text-gray-800">
            Monto Total: ${montoTotal.toFixed(2)}
          </p>
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Confirmar Reserva
        </button>
      </form>

      {mostrarModalPago && (
        <ModalPago
          visible={mostrarModalPago}
          onCancelar={() => setMostrarModalPago(false)}
          onConfirmar={() => {
            crearReserva();
            setMostrarModalPago(false);
          }}
          montoTotal={montoTotal}
          moneda={moneda}
          metodoPago={metodoPago}
        />
      )}
    </div>
  );
}
