const express = require('express');
const router = express.Router();
const ciudadesTerminalesController = require('../controllers/ciudadesTerminales.controller');

// Ruta para obtener ciudades con sus terminales agrupados
router.get('/ciudades-terminales', ciudadesTerminalesController.getCiudadesConTerminales);

// Ruta para obtener datos planos para tabla (ciudad-terminal por fila)
router.get('/ciudades-terminales/plano', ciudadesTerminalesController.getCiudadesTerminalesPlano);

module.exports = router;
