const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/compras.controller');

// POST /api/compras - Crear compra completa
router.post('/', comprasController.crearCompraCompleta);

// GET /api/compras - Obtener todas las compras
router.get('/', comprasController.obtenerCompras);

// GET /api/compras/:id - Obtener compra por ID
router.get('/:id', comprasController.obtenerCompraPorId);

// POST /api/compras/verificar-asientos - Verificar disponibilidad de asientos
router.post('/verificar-asientos', comprasController.verificarDisponibilidadAsientos);

module.exports = router;
