const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
require('dotenv').config();
const { Sequelize } = require("sequelize");

const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const bdd_name = "transportesec";
const hostName = "localhost";

// 1. Crear la base de datos si no existe
async function ensureDatabaseAndSync() {
    // Conexión inicial sin base
    const initialSequelize = new Sequelize(`mysql://${username}:${password}@${hostName}`);
    try {
        await initialSequelize.query(`CREATE DATABASE IF NOT EXISTS ${bdd_name};`);
        console.log("DBB creada o ya existía");
    } catch (error) {
        console.error("Error al crear la BDD", error);
        process.exit(1);
    } finally {
        await initialSequelize.close();
    }

    // 2. Cargar modelos (ahora sí existe la base)
    const sequelize = require('./config/sequelize.config');
    require('./models/index');

    // 3. Sincronizar y poblar datos
    try {
        await sequelize.sync({ force: true });
        console.log(`Base de datos ${bdd_name} sincronizada`);
        const { cargarDatosPrueba } = require('./database/data/load_test_data');
        await cargarDatosPrueba();
        console.log('✅ Datos de prueba cargados correctamente');
    } catch (error) {
        console.error(`Error al sincronizar la base de datos ${bdd_name}`, error);
        process.exit(1);
    }
}

// Ejecuta la inicialización y luego arranca el servidor
ensureDatabaseAndSync().then(() => {
    // Middlewares
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

const usuariosRoutes = require('./routes/usuario.routes');
const rutasRoutes = require('./routes/rutas.routes');
const viajesRoutes = require('./routes/viajes.routes');
const unidadesRoutes = require('./routes/unidades.routes');
const asientosRoutes = require('./routes/asientos.routes');
const cooperativasRoutes = require('./routes/cooperativas.routes');
const conductoresRoutes = require('./routes/conductores.routes');
const terminalesRoutes = require('./routes/terminales.routes');
const ciudadesRoutes = require('./routes/ciudades.routes');
const boletosRoutes = require('./routes/boletos.routes');
const ciudadesTerminalesRoutes = require('./routes/ciudadesTerminales.routes');
const pasajerosRoutes = require('./routes/pasajeros.routes');
const comprasRoutes = require('./routes/compras.routes');

// Aplicar rutas
app.use('/usuarios', usuariosRoutes);
//app.use('/api/compras', comprasRoutes);

// Rutas con funciones
rutasRoutes(app);
viajesRoutes(app);
unidadesRoutes(app);
asientosRoutes(app);
cooperativasRoutes(app);
conductoresRoutes(app);
terminalesRoutes(app);
ciudadesRoutes(app);
boletosRoutes(app);
ciudadesTerminalesRoutes(app);
pasajerosRoutes(app);
comprasRoutes(app);
console.log('Todas las rutas cargadas exitosamente!');


    // Middleware para manejar rutas no encontradas
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
      });
    });

    // Middleware global de manejo de errores
    app.use((error, req, res, next) => {
      console.error('Error no manejado:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
      });
    });

    // Inicio del servidor
    app.listen(port, () => {
      console.log('🚀 SERVIDOR BACKEND INICIADO');
      console.log('==============================');
      console.log(`🌐 URL: http://localhost:${port}`);
      console.log('📋 Endpoints disponibles:');
      console.log('   🔐 POST /auth/login - Login universal');
      console.log('   👤 POST /auth/registro/usuario - Registro usuario');
      console.log('   🏢 POST /auth/registro/cooperativa - Registro cooperativa');
      console.log('   📊 GET /ciudades-terminales/plano - Datos tabla');
      console.log('   🏙️ GET /ciudades - Listado ciudades');
      console.log('   🚌 GET /terminales - Listado terminales');
      console.log('==============================');
    });
});