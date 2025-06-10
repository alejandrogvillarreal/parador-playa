const API_URL = "http://localhost:4000/clientes";

export const getClientes = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener clientes");
  return data;
};

export const createCliente = async (cliente) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al crear cliente");
  return data;
};

export const updateCliente = async (id, cliente) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar cliente");
  return data;
};

export const deleteTarjeta = async (clienteId, tarjetaId) => {
  const res = await fetch(`${API_URL}/${clienteId}/tarjetas/${tarjetaId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al eliminar tarjeta");
  return data;
};
