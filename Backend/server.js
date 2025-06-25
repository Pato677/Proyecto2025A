const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');


// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const usuariosRouter = require('./routes/usuario');
app.use('/UsuarioPasajero', usuariosRouter);

//Unidades
const unidadesRouter = require('./routes/unidades');
app.use('/unidades', unidadesRouter);

// Rutas
const rutasRouter = require('./routes/rutas');
app.use('/Rutas', rutasRouter);

// Paradas
const paradasRouter = require('./routes/paradas');
app.use('/rutas', paradasRouter);

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});