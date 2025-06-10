import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-6">
        <span className="text-2xl font-semibold whitespace-nowrap text-blue-600">
          Hola, {username || "Invitado"}
        </span>

        {/* Botón hamburguesa */}
        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          title="Abrir menú"
        >
          <span className="sr-only">Abrir menú principal</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Botones principales en desktop */}
        <div className="hidden md:flex items-center gap-2 md:order-2">
          <Link
            to="/reserva"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
          >
            Nueva Reserva
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
            title="Cerrar sesión"
          >
            Salir
          </button>
        </div>

        {/* Menú colapsable (mobile) */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-8 p-4 md:p-0 mt-4 md:mt-0 font-medium border border-gray-100 rounded-lg bg-gray-50 md:border-0 md:bg-white">
            <li>
              <Link
                to="/dashboard"
                className="block py-2 px-3 text-gray-700 hover:text-blue-700 md:p-0"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/reservas"
                className="block py-2 px-3 text-gray-700 hover:text-blue-700 md:p-0"
                onClick={() => setMenuOpen(false)}
              >
                Mis Reservas
              </Link>
            </li>

            {/* Botones móviles */}
            <li className="mt-2 flex md:hidden flex-col gap-2">
              <Link
                to="/reserva"
                onClick={() => setMenuOpen(false)}
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
              >
                Nueva Reserva
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
              >
                Salir
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
