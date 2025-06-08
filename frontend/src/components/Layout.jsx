import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="pt-20 px-4 bg-gray-100 min-h-screen">
        <section className="max-w-screen-xl mx-auto">
          <Outlet />
        </section>
      </main>
    </>
  );
}
