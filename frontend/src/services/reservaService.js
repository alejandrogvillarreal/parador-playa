const API_URL = "http://localhost:4000/reservas";

export const getReservas = async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener reservas");
    return res.json();
};

export const getReservasByCliente = async (clienteId) => {
    const res = await fetch(`${API_URL}/cliente/${clienteId}`);
    if (!res.ok) throw new Error("Error al obtener reservas del cliente");
    return res.json();
};

export const createReserva = async (reserva) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear reserva");
    }
    return res.json();
};

export const cancelarReserva = async (id) => {
    const res = await fetch(`${API_URL}/${id}/cancelar`, {
        method: "PUT",
    });
    if (!res.ok) throw new Error("Error al cancelar reserva");
    return res.json();
};

export const pagarReserva = async (id) => {
    const res = await fetch(`${API_URL}/${id}/pagar`, {
        method: "PUT",
    });
    if (!res.ok) throw new Error("Error al pagar reserva");
    return res.json();
};

export const reembolsarPorTormenta = async (id) => {
    const res = await fetch(`${API_URL}/${id}/tormenta`, {
        method: "PUT",
    });
    if (!res.ok) throw new Error("Error al aplicar reembolso");
    return res.json();
};
