const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['contrasena'] } // No enviar contraseñas
        });
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['contrasena'] }
        });
        
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear nuevo usuario
const createUsuario = async (req, res) => {
    try {
        const { id, nombres, apellidos, fechaNacimiento, cedula, correo, telefono, contrasena } = req.body;
        
        // Encriptar contraseña
        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);
        
        const nuevoUsuario = await Usuario.create({
            id,
            nombres,
            apellidos,
            fechaNacimiento,
            cedula,
            correo,
            telefono,
            contrasena: contrasenaEncriptada
        });
        
        // No enviar la contraseña en la respuesta
        const { contrasena: _, ...usuarioSinContrasena } = nuevoUsuario.toJSON();
        res.status(201).json(usuarioSinContrasena);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Actualizar usuario
const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, fechaNacimiento, cedula, correo, telefono, contrasena } = req.body;
        
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const updateData = {
            nombres,
            apellidos,
            fechaNacimiento,
            cedula,
            correo,
            telefono
        };
        
        // Solo encriptar nueva contraseña si se proporciona
        if (contrasena) {
            updateData.contrasena = await bcrypt.hash(contrasena, 10);
        }
        
        await usuario.update(updateData);
        
        // No enviar la contraseña en la respuesta
        const { contrasena: _, ...usuarioSinContrasena } = usuario.toJSON();
        res.json(usuarioSinContrasena);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Eliminar usuario
const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        await usuario.destroy();
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Login de usuario
const loginUsuario = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        
        const usuario = await Usuario.findOne({ where: { correo } });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!contrasenaValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        // No enviar la contraseña en la respuesta
        const { contrasena: _, ...usuarioSinContrasena } = usuario.toJSON();
        res.json(usuarioSinContrasena);
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    loginUsuario
};