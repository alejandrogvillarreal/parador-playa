# Parador Playa 🏖️

Sistema de Gestión de Alquiler de Productos de Playa.

---

## Proyecto

Este repositorio contiene el desarrollo del **Trabajo Práctico Integrador** para la **Universidad de Palermo** en el marco de la asignatura **Fullstack Web Development**.

El objetivo es construir una solución completa **backend + frontend** para la gestión de alquiler de productos de un parador en el Caribe.

---

## Enunciado

Se requiere generar un sistema de gestión de alquiler de productos de playa para un parador en el Caribe.

El parador cuenta con los siguientes productos para alquilar:

- JetSky
- Cuatriciclos
- Equipo de buceo
- Tablas de surf (para niños y para adultos)

**Reglas de negocio:**

- Para el alquiler de **JetSky** o **Cuatriciclos** se requiere también alquilar un **casco**; además el JetSky exige un **chaleco salvavidas**.
- Se pueden subir **máximo 2 personas** por vehículo, por lo que se alquilarán uno o dos dispositivos de seguridad según corresponda.
- La duración del alquiler de cualquier producto es de **30 minutos** por turno.
- Un cliente puede adquirir hasta **3 turnos consecutivos**.
- Si se alquilan **más de un producto**, se aplica un **10% de descuento** en el total a pagar.
- Los turnos se pueden reservar con **máximo 48 hs de anticipación**.
- Se pueden cancelar sin costo hasta **2 horas antes** del turno.
- El pago en efectivo debe realizarse al menos **2 horas antes** del turno para asegurar la reserva, de lo contrario el turno se libera.
- Se puede pagar en **moneda local** o **extranjera**.
- Existe un **seguro de tormenta**: si no se puede disfrutar el turno por una tormenta imprevista, se devuelve el **50% del valor abonado**.

---

## Estructura del Proyecto

```
parador-playa/
│
├── backend/
│   └── (API REST desarrollada en Node.js, Express y MongoDB Atlas)
│
├── frontend/
│   └── (Aplicación web desarrollada con React)
│
└── README.md (este archivo)
```

- El detalle completo del backend (instalación, configuración y endpoints) se encuentra en el archivo [`backend/README.md`](backend/README.md).
- Documentación detallada del frontend en [`frontend/README.md`](frontend/README.md)

---

## Tecnologías utilizadas

- **Backend**: Node.js, Express, MongoDB Atlas
- **Frontend**: React, React Router DOM, TailwindCSS, Flowbite, Vite

---

## Estado del Proyecto

- Backend: **✅ Completado**
- Frontend: **✅ Completado**
- Integración: **✅ Totalmente funcional**

---

## Autor

- Alejandro Villarreal
