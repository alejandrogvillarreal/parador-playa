import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PRECIO_CASCO, PRECIO_CHALECO } from "../constants";
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

  const cargarProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    let total = 0;
    let totalTurnos = 0;

      productosSeleccionados.forEach((p) => {
        const productoInfo = productos.find((prod) => prod._id === p._id);
        if (productoInfo) {
          const precioBase = p.turnos * productoInfo.precio;
          const casco = productoInfo.requiereCasco ? p.personas : 0;
          const chaleco = productoInfo.requiereChaleco ? p.personas : 0;
          const precioDispositivos = casco * PRECIO_CASCO + chaleco * PRECIO_CHALECO;

          total += precioBase + precioDispositivos;
          totalTurnos += p.turnos;
        }
      });

      if (productosSeleccionados.length > 1) total *= 0.9;

      setTurnosTotales(totalTurnos);
      setMontoTotal(total);
  }, [productosSeleccionados, productos]);

  const handleProductoSelect = (productoId, nuevosTurnos, nuevasPersonas) => {
    setProductosSeleccionados((prev) => {
      const anterior = prev.find((p) => p._id === productoId);
      const sinProducto = prev.filter((p) => p._id !== productoId);

      const turnos = nuevosTurnos !== undefined ? nuevosTurnos : anterior?.turnos || 0;
      const personas = nuevasPersonas !== undefined ? nuevasPersonas : anterior?.personas || 1;

      if (turnos > 0 || anterior) {
        return [...sinProducto, { _id: productoId, turnos, personas }];
      }
      return sinProducto;
    });
  };

  const generarTurnosDisponibles = () => {
    const horarios = [];
    for (let h = 8; h <= 18; h++) {
      horarios.push(`${h.toString().padStart(2, "0")}:00`);
      horarios.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return horarios;
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
    
    const ahora = new Date();
    const fechaSeleccionada = new Date(fechaHora);

    if (!fechaHora || fechaSeleccionada < ahora) {
      alert("La fecha y hora deben ser válidas y futuras.");
      return;
    }

    const diferenciaHoras = (fechaSeleccionada - ahora) / (1000 * 60 * 60);
    if (diferenciaHoras > 48) {
      alert("La reserva no puede realizarse con más de 48 hs de anticipación.");
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

      const productosPayload = productosSeleccionados.filter((p) => p.turnos > 0).map((p) => ({
        producto: p._id,
        personas: p.personas,
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
        <h2 className="text-2xl font-semibold mb-4">Seleccioná los productos y la cantidad de turnos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((producto) => {
            const seleccionado = productosSeleccionados.find((p) => p._id === producto._id);
            const maxTurnosPermitidos = 3 - turnosTotales + (seleccionado?.turnos || 0);
            return (
              <ProductoSelectorCard
                key={producto._id}
                producto={producto}
                turnosSeleccionados={seleccionado?.turnos || 0}
                personasSeleccionadas={seleccionado?.personas || 1}
                maxTurnosPermitidos={maxTurnosPermitidos}
                onCambiarProducto={handleProductoSelect}
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
              {productosSeleccionados
                .filter((p) => p.turnos > 0)
                .map((p) => {
                  const productoInfo = productos.find((prod) => prod._id === p._id);
                  return (
                    <li key={p._id} className="flex justify-between items-center bg-white p-4 rounded shadow">
                      <span>{productoInfo?.nombre}</span>
                      <span>{p.turnos} turnos · {p.personas} persona(s)</span>
                    </li>
                  );
                })}
            </ul>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={fechaHora.split("T")[0]}
            min={new Date().toISOString().split("T")[0]} // hoy
            max={new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split("T")[0]} // hoy + 48hs
            onChange={(e) => {
              const hora = fechaHora.split("T")[1]?.substring(0, 5) || "08:00";
              setFechaHora(`${e.target.value}T${hora}`);
            }}
            required
          />

          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Seleccioná un horario
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {generarTurnosDisponibles().map((hora) => (
              <button
                key={hora}
                type="button"
                onClick={() => {
                  const fecha = fechaHora.split("T")[0] || new Date().toISOString().split("T")[0];
                  setFechaHora(`${fecha}T${hora}`);
                }}
                className={`py-1 px-2 rounded border text-xs font-medium text-center ${
                  fechaHora.endsWith(hora)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                }`}
              >
                {hora}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Método de Pago</label>
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
          <label className="block text-sm font-semibold text-gray-700">Moneda</label>
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
