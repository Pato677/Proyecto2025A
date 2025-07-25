const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación y rol de superusuario
router.use(authMiddleware);
router.use(authMiddleware.requireRole('superusuario'));

// Obtener todos los usuarios con filtros y paginación
router.get('/', UsuarioController.getAllUsuarios);

// Obtener usuario por ID con información completa
router.get('/:id', UsuarioController.getUsuarioById);

// Crear nuevo usuario (solo superusuarios)
router.post('/', UsuarioController.createUsuario);

// Actualizar usuario
router.put('/:id', UsuarioController.updateUsuario);

// Eliminar usuario
router.delete('/:id', UsuarioController.deleteUsuario);

// Verificar si email existe
router.get('/verificar-email/:email', UsuarioController.verificarEmail);

module.exports = router;