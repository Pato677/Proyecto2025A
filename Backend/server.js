const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');


// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const usuariosRouter = require('./routes/usuario');
app.use('/pasajeros', usuariosRouter);

//Unidades
const unidadesRouter = require('./routes/unidades');
app.use('/unidades', unidadesRouter);

// Rutas
const rutasRouter = require('./routes/rutas');
app.use('/rutas', rutasRouter);

// Paradas
const paradasRouter = require('./routes/paradas');
app.use('/rutas', paradasRouter);

//terminales
const terminalesRouter = require('./routes/terminales');
app.use('/terminales', terminalesRouter);
// cooperativas
const cooperativasRouter = require('./routes/cooperativas');
app.use('/cooperativas', cooperativasRouter);

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});