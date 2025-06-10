import { API_BASE } from "../constants";
const API_URL = `${API_BASE}/productos`;

export const getProductos = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener productos");
  return data;
};

export const getProductoById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener producto");
  return data;
};

export const createProducto = async (producto) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al crear producto");
  return data;
};
