# Frontend · Parador Playa 🏖️

Aplicación web del sistema de gestión de alquiler de productos de playa desarrollado con **React** y **TailwindCSS**, como parte del **Trabajo Práctico Integrador** de la materia **Fullstack Web Development** – Universidad de Palermo.

---

## Requisitos

- Node.js v18+
- npm v9+
- Navegador moderno

---

## Instalación

### Clonar el repositorio:

```bash
git clone https://github.com/alejandrogvillarreal/parador-playa.git
cd parador-playa/frontend
```

### Instalar dependencias:

```bash
npm install
```

---

## Cómo correr el proyecto

```bash
npm run dev
```

El frontend se ejecutará en: http://localhost:5173

Asegurate de tener el backend corriendo en paralelo en http://localhost:4000

---

## Funcionalidades principales

- Visualización de productos disponibles

- Formulario de reserva con turnos y dispositivos

- Gestión de reservas por cliente

- Cancelación de reservas con validación de tiempo

- Pagos en efectivo o tarjeta

- Reembolso por tormenta (opcional)

- Visualización de dispositivos extra (casco, chaleco)

- Simulador de login con persistencia por localStorage

---

## Estructura del proyecto

```bash
frontend/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx 
│   ├── main.jsx
│   └── index.css
│
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
└── README.md
```

---

## Funcionalidades técnicas destacadas

| Componente             | Funcionalidad                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `Login`                | Inicio de sesión simulado por nombre                                               |
| `Dashboard`            | Muestra resumen de actividad y últimas reservas                                    |
| `ReservaPage`          | Permite reservar productos con turnos validados y lógica de negocio                |
| `ListadoReservas`      | Lista y clasifica reservas: futuras, pasadas, canceladas                           |
| `ReservaCard`          | Componente visual para reservas individuales                                       |
| `ProductoSelectorCard` | Muestra detalles del producto, inputs de turnos/personas y dispositivos requeridos |
| `ModalPago`            | Simulación del proceso de pago o reembolso                                         |


---

## Autor

- Alejandro Villarreal
