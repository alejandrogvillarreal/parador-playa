require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const Cliente = require('./models/Cliente');

const productos = [
    {
        nombre: 'JetSky',
        tipo: 'jetsky',
        precio: 100,
        requiereCasco: false,
        requiereChaleco: true,
        cantidadPersonasMax: 2,
        imagen: "https://images.pexels.com/photos/33046/jet-ski-water-sport-water-bike-water.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        nombre: 'Cuatriciclo',
        tipo: 'cuatriciclo',
        precio: 80,
        requiereCasco: true,
        requiereChaleco: false,
        cantidadPersonasMax: 2,
        imagen: "https://images.pexels.com/photos/1135195/pexels-photo-1135195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        nombre: 'Equipo de buceo',
        tipo: 'buceo',
        precio: 60,
        requiereCasco: false,
        requiereChaleco: false,
        cantidadPersonasMax: 1,
        imagen: "https://images.pexels.com/photos/3113225/pexels-photo-3113225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        nombre: 'Tabla de surf (niños)',
        tipo: 'tabla surf niño',
        precio: 40,
        requiereCasco: false,
        requiereChaleco: false,
        cantidadPersonasMax: 1,
        imagen: "https://images.pexels.com/photos/7850500/pexels-photo-7850500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        nombre: 'Tabla de surf (adultos)',
        tipo: 'tabla surf adulto',
        precio: 50,
        requiereCasco: false,
        requiereChaleco: false,
        cantidadPersonasMax: 1,
        imagen: "https://images.pexels.com/photos/7659118/pexels-photo-7659118.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
];

const clientes = [
    {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        documento: '12345678',
        tarjetas: [
            {
                numero: '1234567812345678',
                tipo: 'visa',
                vencimiento: '12/25',
                titular: 'Juan Pérez',
                codigoSeguridad: '123'
            }
        ]
    },
    {
        nombre: 'Ana',
        apellido: 'Gómez',
        email: 'ana@example.com',
        documento: '23456789'
    },
    {
        nombre: 'Carlos',
        apellido: 'Díaz',
        email: 'carlos@example.com',
        documento: '34567890'
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Producto.deleteMany({});
        await Cliente.deleteMany({});

        const productosCreados = await Producto.insertMany(productos);
        const clientesCreados = await Cliente.insertMany(clientes);

        console.log('🌴 Datos insertados con éxito:');
        console.log(`Productos: ${productosCreados.length}`);
        console.log(`Clientes: ${clientesCreados.length}`);

        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error al insertar datos:', error);
    }
};

seedData();
