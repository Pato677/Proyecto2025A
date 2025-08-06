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

const usuariosRoutes = require('./routes/usuarios.routes');
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

app.use('/usuarios', usuariosRoutes);
app.use('/rutas', rutasRoutes);
app.use('/viajes', viajesRoutes);
app.use('/unidades', unidadesRoutes);
app.use('/asientos', asientosRoutes);
app.use('/cooperativas', cooperativasRoutes);
app.use('/conductores', conductoresRoutes);
app.use('/terminales', terminalesRoutes);
app.use('/ciudades', ciudadesRoutes);
app.use('/boletos', boletosRoutes);
app.use('/ciudades-terminales', ciudadesTerminalesRoutes);
app.use('/pasajeros', pasajerosRoutes);
app.use('/compras', comprasRoutes);
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

    function printAllEndpoints(app) {
      const endpoints = [];
      app._router.stack.forEach((middleware) => {
        if (middleware.route) {
          // routes registered directly on the app
          const methods = Object.keys(middleware.route.methods)
            .map(m => m.toUpperCase())
            .join(', ');
          endpoints.push(`${methods} ${middleware.route.path}`);
        } else if (middleware.name === 'router') {
          // router middleware 
          middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
              const methods = Object.keys(handler.route.methods)
                .map(m => m.toUpperCase())
                .join(', ');
              endpoints.push(`${methods} ${handler.route.path}`);
            }
          });
        }
      });
      console.log('📋 Endpoints disponibles:');
      endpoints.forEach(e => console.log('   ', e));
    }

    // Inicio del servidor
    app.listen(port, () => {
      console.log('🚀 SERVIDOR BACKEND INICIADO');
      console.log('==============================');
      console.log(`🌐 URL: http://localhost:${port}`);
      printAllEndpoints(app);
      console.log('==============================');
    });
});