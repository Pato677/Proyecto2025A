const express = require('express');
const router = express.Router();
const pasajerosController = require('../controllers/pasajeros.controller');

// GET /api/pasajeros - Obtener todos los pasajeros
router.get('/', pasajerosController.obtenerPasajeros);

// GET /api/pasajeros/:id - Obtener pasajero por ID
router.get('/:id', pasajerosController.obtenerPasajeroPorId);

// GET /api/pasajeros/cedula/:cedula - Buscar pasajero por cédula
router.get('/cedula/:cedula', pasajerosController.buscarPasajeroPorCedula);

// POST /api/pasajeros - Crear nuevo pasajero
router.post('/', pasajerosController.crearPasajero);

module.exports = router;
