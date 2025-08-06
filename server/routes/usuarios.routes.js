const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Comentamos temporalmente la autenticación para pruebas
// router.use(authMiddleware);
// router.use(authMiddleware.requireRole('superusuario'));

// Login de usuario (público - sin autenticación)
router.post('/login', UsuarioController.login);

// Obtener cooperativas desactivadas (para solicitudes)
router.get('/cooperativas/desactivadas', UsuarioController.getCooperativasDesactivadas);

// Obtener todos los usuarios con filtros y paginación
router.get('/', UsuarioController.getAllUsuarios);

// Obtener usuario por ID con información completa (requiere autenticación)
router.get('/:id', authMiddleware, UsuarioController.getUsuarioById);

// Crear nuevo usuario (solo superusuarios)
router.post('/', UsuarioController.createUsuario);

// Actualizar usuario (requiere autenticación)
router.put('/:id', authMiddleware, UsuarioController.updateUsuario);

// Actualizar estado de cooperativa específicamente
router.patch('/:id/estado', UsuarioController.actualizarEstadoCooperativa);

// Eliminar usuario (requiere autenticación)
router.delete('/:id', authMiddleware, UsuarioController.deleteUsuario);

// Verificar si email existe
router.get('/verificar-email/:correo', UsuarioController.verificarEmail);

// Verificar si cédula existe
router.get('/verificar-cedula/:cedula', UsuarioController.verificarCedula);

// Debug: Listar todos los emails (temporal)
router.get('/debug/emails', UsuarioController.listarEmails);

// Ruta especial para actualizar contraseñas planas (solo desarrollo)
router.post('/actualizar-contrasenas', UsuarioController.actualizarContrasenasPlanas);

module.exports = router;