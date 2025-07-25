// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt');
        
        // Verificar que el usuario aún existe y está activo
        const usuario = await Usuario.findByPk(decoded.id);
        if (!usuario || usuario.estado !== 'activo') {
            return res.status(401).json({
                success: false,
                message: 'Usuario no válido o inactivo'
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};

// Middleware para verificar roles específicos
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para acceder a este recurso'
            });
        }

        next();
    };
};

module.exports = authMiddleware;
module.exports.requireRole = requireRole;
