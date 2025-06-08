import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClientes } from "../services/clienteService";

export default function Login() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim()) {
      setError("Por favor ingresá tu nombre.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const clientes = await getClientes();
      const cliente = clientes.find(
        (c) => c.nombre.toLowerCase() === username.trim().toLowerCase()
      );

      if (!cliente) {
        setError("No se encontró un cliente con ese nombre.");
        setLoading(false);
        return;
      }

      localStorage.setItem("username", cliente.nombre);
      localStorage.setItem("clienteId", cliente._id);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error. Intentalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Bienvenido</h1>

        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Ingresá tu nombre
        </label>
        <input
          id="username"
          type="text"
          placeholder="Ej: Alejandro"
          className="w-full border border-gray-300 p-2 rounded mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
        />

        {error && (
          <p className="text-red-600 text-sm mb-2 text-center">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full text-white font-semibold py-2 px-4 rounded ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </div>
    </div>
  );
}
