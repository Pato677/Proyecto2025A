const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

// Cargar modelos después de configurar la base
require('./models/index');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de autenticación (públicas)
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// Rutas protegidas
const usuariosRoutes = require('./routes/usuario.routes');
const cooperativasRoutes = require('./routes/cooperativas.routes');
const unidadesRoutes = require('./routes/unidades.routes');
const conductoresRoutes = require('./routes/conductores.routes');
const rutasRoutes = require('./routes/rutas.routes');
const terminalesRoutes = require('./routes/terminales.routes');
const ciudadesRoutes = require('./routes/ciudades.routes');
const viajesRoutes = require('./routes/viajes.routes');
const boletosRoutes = require('./routes/boletos.routes');
const ciudadesTerminalesRoutes = require('./routes/ciudadesTerminales.routes');

// Registrar las rutas con prefijos
app.use('/usuarios', usuariosRoutes);
app.use('/cooperativas', cooperativasRoutes);
app.use('/unidades', unidadesRoutes);
app.use('/conductores', conductoresRoutes);
app.use('/rutas', rutasRoutes);
app.use('/terminales', terminalesRoutes);
app.use('/ciudades', ciudadesRoutes);
app.use('/viajes', viajesRoutes);
app.use('/boletos', boletosRoutes);
app.use('/', ciudadesTerminalesRoutes);

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