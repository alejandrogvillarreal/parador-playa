# API Gestión de Alquiler de Productos de Playa 🏖️

## Descripción

Este proyecto es una API REST creada con **Node.js**, **Express** y **MongoDB Atlas** para gestionar:
- Productos de playa disponibles para alquilar
- Clientes del parador
- Reservas de productos

Se entrega junto a una colección de **Postman** para facilitar las pruebas de los endpoints.

---

## Requisitos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Cuenta en MongoDB Atlas (o un cluster de MongoDB accesible)

---

## Instalación

### Clonar el repositorio:

```bash
git clone https://github.com/alejandrogvillarreal/parador-playa.git
cd parador-playa/backend
```

### Instalar dependencias:

```bash
npm install
```

### Configurar variables de entorno:

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=4000
MONGO_URI=tu_url_de_conexion_a_mongodb
```

> Reemplazar `tu_url_de_conexion_a_mongodb` con tu cadena real de conexión de MongoDB Atlas.

---

## Cómo correr el proyecto

```bash
npm start
```

El servidor iniciará en: [http://localhost:4000](http://localhost:4000)

En consola deberías ver:

```bash
Conectado a MongoDB Atlas
Servidor corriendo en http://localhost:4000
```

---

## Endpoints disponibles

### Productos (`/productos`)

| Método | Ruta               | Descripción                |
|:------:|:------------------- |:---------------------------|
| POST   | `/productos/`        | Crear un nuevo producto     |
| GET    | `/productos/`        | Listar todos los productos  |
| GET    | `/productos/:id`     | Obtener un producto por ID  |

---

### Clientes (`/clientes`)

| Método | Ruta                                 | Descripción                          |
|:------:|:------------------------------------ |:------------------------------------ |
| POST   | `/clientes/`                         | Crear un nuevo cliente              |
| GET    | `/clientes/`                         | Listar todos los clientes           |
| PUT    | `/clientes/:id`                      | Editar un cliente existente         |
| DELETE | `/clientes/:id/tarjetas/:tarjetaId`   | Eliminar una tarjeta de un cliente  |

---

### Reservas (`/reservas`)

| Método | Ruta                                 | Descripción                                   |
|:------:|:------------------------------------ |:-------------------------------------------- |
| POST   | `/reservas/`                         | Crear una nueva reserva                     |
| GET    | `/reservas/`                         | Listar todas las reservas                   |
| GET    | `/reservas/:id`                      | Obtener una reserva por ID                  |
| PUT    | `/reservas/:id/cancelar`              | Cancelar una reserva                        |
| PUT    | `/reservas/:id/pagar`                 | Pagar una reserva                           |
| PUT    | `/reservas/:id/tormenta`              | Reembolsar reserva por tormenta             |
| GET    | `/reservas/cliente/:clienteId`        | Obtener reservas de un cliente específico   |
| PATCH  | `/reservas/liberar/no-pagadas`        | Liberar reservas no pagadas automáticamente |

---

## Colección de Postman 📬

Se incluye un archivo `.json` con la **colección de Postman** que contiene todos los endpoints listos para probar.

### Para usarla:

1. Abrir Postman.
2. Ir a **Importar**.
3. Seleccionar el archivo de colección.

---

## Estructura del proyecto

```bash
backend/
│
├── controllers/
│   ├── clientes.js
│   ├── productos.js
│   └── reservas.js
│
├── models/
│   ├── Cliente.js
│   ├── Producto.js
│   └── Reserva.js
│
├── routes/
│   ├── clientes.js
│   ├── productos.js
│   └── reservas.js
│
├── utils/
│   └── transformarReservaDTO.js
│
├── .env
├── app.js
├── server.js
├── seed.js
├── package.json
└── README.md
```

---

## Notas

- El endpoint raíz (`/`) responde con el mensaje: **"API del Parador funcionando 🚤"**.
- La conexión a MongoDB está protegida mediante **variables de entorno**.
- Se utiliza **CORS** para permitir peticiones externas.

---

## Autor

- Alejandro Villarreal
