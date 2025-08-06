const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
require('./config/sequelize.config')
// Cargar modelos después de configurar la base

require('./models/index');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de autenticación (públicas)
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// Rutas de usuarios
const usuariosRoutes = require('./routes/usuario.routes');
app.use('/usuarios', usuariosRoutes);

// Rutas principales
const cooperativasRoutes = require('./routes/cooperativas.routes');
const unidadesRoutes = require('./routes/unidades.routes');
const conductoresRoutes = require('./routes/conductores.routes');
const rutasRoutes = require('./routes/rutas.routes');
const viajesRoutes = require('./routes/viajes.routes');
const comprasRoutes = require('./routes/compras.routes');
const pasajerosRoutes = require('./routes/pasajeros.routes');
const asientosRoutes = require('./routes/asientos.routes');
const terminalesRoutes = require('./routes/terminales.routes');
const ciudadesRoutes = require('./routes/ciudades.routes');
const boletosRoutes = require('./routes/boletos.routes');
const ciudadesTerminalesRoutes = require('./routes/ciudadesTerminales.routes');

// Aplicar rutas
app.use('/usuarios', usuariosRoutes);
//app.use('/api/compras', comprasRoutes);

// Rutas con funciones
comprasRoutes(app);
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