import { API_BASE } from "../constants";
const API_URL = `${API_BASE}/reservas`;

export const getReservas = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener reservas");
  return data;
};

export const getReservasByCliente = async (clienteId) => {
  const res = await fetch(`${API_URL}/cliente/${clienteId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener reservas del cliente");
  return data;
};

export const createReserva = async (reserva) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reserva),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al crear reserva");
  return data;
};

export const cancelarReserva = async (id) => {
  const res = await fetch(`${API_URL}/${id}/cancelar`, {
    method: "PUT",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al cancelar reserva");
  return data;
};

export const pagarReserva = async (id, metodoPago, moneda) => {
  const res = await fetch(`${API_URL}/${id}/pagar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ metodoPago, moneda }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al pagar reserva");
  return data;
};

export const reembolsarPorTormenta = async (id) => {
  const res = await fetch(`${API_URL}/${id}/tormenta`, {
    method: "PUT",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al aplicar reembolso");
  return data;
};

export const getHorariosOcupados = async (productoId, fecha) => {
  const res = await fetch(`http://localhost:4000/reservas/horarios?productoId=${productoId}&fecha=${fecha}`);
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Error al obtener horarios ocupados");
  }
  return res.json(); // { horarios: ["10:00", "10:30", ...] }
};
