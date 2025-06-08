import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reserva from "./pages/Reserva";
import ListadoReservas from "./pages/ListadoReservas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta sin layout */}
        <Route path="/" element={<Login />} />

        {/* Rutas con layout */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reserva" element={<Reserva />} />
          <Route path="reservas" element={<ListadoReservas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
