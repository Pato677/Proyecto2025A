// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rutas públicas (no requieren autenticación)
router.post('/registro/usuario', authController.registrarUsuario);
router.post('/registro/cooperativa', authController.registrarCooperativa);
router.post('/login', authController.login);

// Rutas protegidas (requieren autenticación)
router.get('/perfil', authMiddleware, authController.obtenerPerfil);
router.put('/perfil', authMiddleware, authController.actualizarPerfil);

module.exports = router;
