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

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});