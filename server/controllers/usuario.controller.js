const Usuario = require('../models/usuario.model');
const UsuarioFinal = require('../models/usuarioFinal.model');
const UsuarioCooperativa = require('../models/usuarioCooperativa.model');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios con información específica
const getAllUsuarios = async (req, res) => {
    try {
        const { rol, estado, page = 1, limit = 10 } = req.query;
        
        const where = {};
        if (rol) where.rol = rol;
        if (estado) where.estado = estado;

        const offset = (page - 1) * limit;

        const usuarios = await Usuario.findAndCountAll({
            where,
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: UsuarioFinal,
                    as: 'datosUsuarioFinal',
                    required: false
                },
                {
                    model: UsuarioCooperativa,
                    as: 'datosCooperativa',
                    required: false
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: usuarios.rows,
            pagination: {
                total: usuarios.count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(usuarios.count / limit)
            }
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

// Obtener usuario por ID con información específica
const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: UsuarioFinal,
                    as: 'datosUsuarioFinal',
                    required: false
                },
                {
                    model: UsuarioCooperativa,
                    as: 'datosCooperativa',
                    required: false
                }
            ]
        });
        
        if (!usuario) {
            return res.status(404).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }
        
        res.json({
            success: true,
            data: usuario
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

// Crear nuevo usuario (solo para superusuarios)
const createUsuario = async (req, res) => {
    try {
        const { 
            email, 
            password, 
            telefono, 
            rol,
            datosUsuarioFinal,
            datosCooperativa
        } = req.body;

        // Verificar que el email no existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }
        
        // Encriptar contraseña
        const passwordEncriptado = await bcrypt.hash(password, 10);
        
        // Crear usuario base
        const nuevoUsuario = await Usuario.create({
            email,
            password: passwordEncriptado,
            telefono,
            rol,
            estado: 'activo',
            email_verificado: true
        });

        // Crear datos específicos según el rol
        if (rol === 'usuario' && datosUsuarioFinal) {
            await UsuarioFinal.create({
                usuario_id: nuevoUsuario.id,
                ...datosUsuarioFinal
            });
        } else if (rol === 'cooperativa' && datosCooperativa) {
            await UsuarioCooperativa.create({
                usuario_id: nuevoUsuario.id,
                ...datosCooperativa
            });
        }

        // Obtener usuario completo para respuesta
        const usuarioCompleto = await Usuario.findByPk(nuevoUsuario.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: UsuarioFinal,
                    as: 'datosUsuarioFinal',
                    required: false
                },
                {
                    model: UsuarioCooperativa,
                    as: 'datosCooperativa',
                    required: false
                }
            ]
        });
        
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: usuarioCompleto
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

// Actualizar usuario
const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            telefono, 
            estado,
            datosUsuarioFinal,
            datosCooperativa
        } = req.body;
        
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }
        
        // Actualizar datos comunes
        const updateData = {};
        if (telefono) updateData.telefono = telefono;
        if (estado) updateData.estado = estado;
        
        await usuario.update(updateData);

        // Actualizar datos específicos según el rol
        if (usuario.rol === 'usuario' && datosUsuarioFinal) {
            const usuarioFinal = await UsuarioFinal.findOne({ where: { usuario_id: id } });
            if (usuarioFinal) {
                await usuarioFinal.update(datosUsuarioFinal);
            }
        } else if (usuario.rol === 'cooperativa' && datosCooperativa) {
            const usuarioCooperativa = await UsuarioCooperativa.findOne({ where: { usuario_id: id } });
            if (usuarioCooperativa) {
                await usuarioCooperativa.update(datosCooperativa);
            }
        }

        // Obtener usuario actualizado
        const usuarioActualizado = await Usuario.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: UsuarioFinal,
                    as: 'datosUsuarioFinal',
                    required: false
                },
                {
                    model: UsuarioCooperativa,
                    as: 'datosCooperativa',
                    required: false
                }
            ]
        });
        
        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: usuarioActualizado
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

// Eliminar usuario
const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }
        
        await usuario.destroy();
        res.json({ 
            success: true,
            message: 'Usuario eliminado correctamente' 
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

// Verificar si un email existe
const verificarEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const usuario = await Usuario.findOne({ where: { email } });
        res.json({ 
            success: true,
            existe: !!usuario 
        });
    } catch (error) {
        console.error('Error al verificar email:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

module.exports = {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    verificarEmail
};

// Endpoint especial para actualizar contraseñas de texto plano a bcrypt
const actualizarContrasenasPlanas = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        let actualizados = 0;
        
        for (let usuario of usuarios) {
            // Verificar si la contraseña NO está encriptada (no empieza con $2)
            if (!usuario.contrasena.startsWith('$2')) {
                const contrasenaEncriptada = await bcrypt.hash(usuario.contrasena, 10);
                await usuario.update({ contrasena: contrasenaEncriptada });
                actualizados++;
                console.log(`Contraseña actualizada para: ${usuario.correo}`);
            }
        }
        
        res.json({ 
            message: `Se actualizaron ${actualizados} contraseñas de texto plano a bcrypt`,
            actualizados 
        });
    } catch (error) {
        console.error('Error al actualizar contraseñas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    verificarEmail,
    actualizarContrasenasPlanas
};