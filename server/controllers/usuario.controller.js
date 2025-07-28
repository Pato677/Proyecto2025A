const Usuario = require('../models/usuario.model');
const UsuarioFinal = require('../models/usuarioFinal.model');
const UsuarioCooperativa = require('../models/usuarioCooperativa.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require ('dotenv').config();

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
            attributes: { exclude: ['contrasena'] },
            include: [
                {
                    model: UsuarioFinal,
                    required: false
                },
                {
                    model: UsuarioCooperativa,
                    required: false
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'DESC']]
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
            attributes: { exclude: ['contrasena'] },
            include: [
                {
                    model: UsuarioFinal,
                    required: false
                },
                {
                    model: UsuarioCooperativa,
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
            correo, 
            contrasena, 
            telefono, 
            rol,
            datosUsuarioFinal,
            datosCooperativa
        } = req.body;

        // Verificar que el email no existe
        const usuarioExistente = await Usuario.findOne({ where: { correo } });
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }
        
        // Encriptar contraseña
        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);
        
        // Crear usuario base
        const nuevoUsuario = await Usuario.create({
            correo,
            contrasena: contrasenaEncriptada,
            telefono,
            rol
        });

        // Crear datos específicos según el rol
        if (rol === 'final' && datosUsuarioFinal) {
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
            attributes: { exclude: ['contrasena'] },
            include: [
                {
                    model: UsuarioFinal,
                    required: false
                },
                {
                    model: UsuarioCooperativa,
                    required: false
                }
            ]
        });

        // Generar token JWT para el usuario recién creado
        const token = jwt.sign(
            { 
                id: nuevoUsuario.id, 
                correo: nuevoUsuario.correo,
                rol: nuevoUsuario.rol 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            token,
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
        
        await usuario.update(updateData);

        // Actualizar datos específicos según el rol
        if (usuario.rol === 'final' && datosUsuarioFinal) {
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
            attributes: { exclude: ['contrasena'] },
            include: [
                {
                    model: UsuarioFinal,
                    required: false
                },
                {
                    model: UsuarioCooperativa,
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
        const { correo } = req.params;
        
        // Decodificar el email por si tiene caracteres especiales
        const emailDecodificado = decodeURIComponent(correo);
        
        // Debug: mostrar el email que se está buscando
        console.log('🔍 Buscando email:', emailDecodificado);
        
        const usuario = await Usuario.findOne({ where: { correo: emailDecodificado } });
        
        // Debug: mostrar resultado de la búsqueda
        console.log('👤 Usuario encontrado:', usuario ? 'SÍ' : 'NO');
        if (usuario) {
            console.log('📧 Email en BD:', usuario.correo);
        }
        
        res.json({ 
            success: true,
            existe: !!usuario,
            emailBuscado: emailDecodificado  // Para debug
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

// Actualizar estado de cooperativa (activo/inactivo)
const actualizarEstadoCooperativa = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar que el estado sea válido
        if (!estado || !['activo', 'inactivo'].includes(estado)) {
            return res.status(400).json({
                success: false,
                message: 'El estado debe ser "activo" o "inactivo"'
            });
        }

        // Verificar que el usuario existe y es una cooperativa
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        if (usuario.rol !== 'cooperativa') {
            return res.status(400).json({
                success: false,
                message: 'Este endpoint solo funciona para usuarios cooperativa'
            });
        }

        // Buscar los datos de la cooperativa
        const usuarioCooperativa = await UsuarioCooperativa.findOne({ 
            where: { usuario_id: id } 
        });

        if (!usuarioCooperativa) {
            return res.status(404).json({
                success: false,
                message: 'Datos de cooperativa no encontrados'
            });
        }

        // Actualizar el estado
        await usuarioCooperativa.update({ estado });

        // Obtener usuario actualizado completo
        const usuarioActualizado = await Usuario.findByPk(id, {
            attributes: { exclude: ['contrasena'] },
            include: [
                {
                    model: UsuarioFinal,
                    required: false
                },
                {
                    model: UsuarioCooperativa,
                    required: false
                }
            ]
        });

        res.json({
            success: true,
            message: `Estado de cooperativa actualizado a: ${estado}`,
            data: usuarioActualizado
        });

    } catch (error) {
        console.error('Error al actualizar estado de cooperativa:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Debug: Listar todos los emails (temporal para depuración)
const listarEmails = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'correo', 'rol']
        });
        
        res.json({
            success: true,
            data: usuarios,
            total: usuarios.length
        });
    } catch (error) {
        console.error('Error al listar emails:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
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



//endpoint para logearse
const login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // Buscar usuario por correo
        const usuario = await Usuario.findOne({ where: { correo } });
        if (!usuario) {
            return res.status(404).json({ 
                success: false, 
                message: 'Usuario no encontrado' 
            });
        }

        // Verificar contraseña
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!contrasenaValida) {
            return res.status(401).json({ 
                success: false, 
                message: 'Contraseña incorrecta' 
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: usuario.id, 
                correo: usuario.correo,
                rol: usuario.rol 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id: usuario.id,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
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
    verificarEmail,
    actualizarEstadoCooperativa,
    listarEmails,
    actualizarContrasenasPlanas,
    login
};


//relaciones extras