const API_URL = "http://localhost:4000/clientes";

export const getClientes = async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener clientes");
    return res.json();
};

export const createCliente = async (cliente) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
    });
    if (!res.ok) throw new Error("Error al crear cliente");
    return res.json();
};

export const updateCliente = async (id, cliente) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
    });
    if (!res.ok) throw new Error("Error al actualizar cliente");
    return res.json();
};

export const deleteTarjeta = async (clienteId, tarjetaId) => {
    const res = await fetch(`${API_URL}/${clienteId}/tarjetas/${tarjetaId}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar tarjeta");
    return res.json();
};
