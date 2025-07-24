const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

// ✅ CARGAR modelos después de configurar la base
require('./server/models/index');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar todas las rutas
const usuariosRoutes = require('./server/routes/usuario.routes');
const cooperativasRoutes = require('./server/routes/cooperativas.routes');
const unidadesRoutes = require('./server/routes/unidades.routes');
const conductoresRoutes = require('./server/routes/conductores.routes');
const rutasRoutes = require('./server/routes/rutas.routes');
const terminalesRoutes = require('./server/routes/terminales.routes');
const ciudadesRoutes = require('./server/routes/ciudades.routes');
const viajesRoutes = require('./server/routes/viajes.routes');
const boletosRoutes = require('./server/routes/boletos.routes');
const ciudadesTerminalesRoutes = require('./server/routes/ciudadesTerminales.routes');

// Registrar las rutas
usuariosRoutes(app);
cooperativasRoutes(app);
unidadesRoutes(app);
conductoresRoutes(app);
rutasRoutes(app);
terminalesRoutes(app);
ciudadesRoutes(app);
viajesRoutes(app);
boletosRoutes(app);
app.use('/', ciudadesTerminalesRoutes);

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});