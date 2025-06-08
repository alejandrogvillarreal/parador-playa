const API_URL = "http://localhost:4000/productos";

export const getProductos = async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener productos");
    return res.json();
};

export const getProductoById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Error al obtener producto");
    return res.json();
};

export const createProducto = async (producto) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
    });
    if (!res.ok) throw new Error("Error al crear producto");
    return res.json();
};
