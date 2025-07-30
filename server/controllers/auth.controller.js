// controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');
const UsuarioFinal = require('../models/usuarioFinal.model');
const UsuarioCooperativa = require('../models/usuarioCooperativa.model');

// Función para generar JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      rol: user.rol 
    },
    process.env.JWT_SECRET || 'tu_secreto_jwt',
    { expiresIn: '24h' }
  );
};

// Registro de usuario final
const registrarUsuario = async (req, res) => {
  try {
    const { 
      correo, 
      contrasena, 
      telefono, 
      nombres, 
      apellidos, 
      cedula, 
      fecha_nacimiento, 
      direccion, 
      ciudad 
    } = req.body;

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(400).json({ 
        success: false, 
        message: 'El correo ya está registrado' 
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear usuario base
    const nuevoUsuario = await Usuario.create({
      correo,
      contrasena: hashedPassword,
      telefono,
      rol: 'final'
    });

    // Crear datos específicos del usuario final
    await UsuarioFinal.create({
      usuario_id: nuevoUsuario.id,
      nombres,
      apellidos,
      cedula,
      fecha_nacimiento,
      direccion,
      ciudad
    });

    // Generar token
    const token = generateToken(nuevoUsuario);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: nuevoUsuario.id,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
        nombres,
        apellidos
      },
      token
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Registro de cooperativa
const registrarCooperativa = async (req, res) => {
  try {
    const {
      correo,
      contrasena,
      telefono,
      razon_social,
      permiso_operacion,
      ruc
    } = req.body;

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El correo ya está registrado'
      });
    }

    // Verificar si el RUC ya existe
    const cooperativaExistente = await UsuarioCooperativa.findOne({ where: { ruc } });
    if (cooperativaExistente) {
      return res.status(400).json({
        success: false,
        message: 'El RUC ya está registrado'
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear usuario base
    const nuevoUsuario = await Usuario.create({
      correo,
      contrasena: hashedPassword,
      telefono,
      rol: 'cooperativa'
    });

    // Crear datos específicos de la cooperativa
    await UsuarioCooperativa.create({
      usuario_id: nuevoUsuario.id,
      razon_social,
      permiso_operacion,
      ruc,
      estado: 'desactivo' // Las cooperativas se crean desactivas por defecto
    });

    // Generar token
    const token = generateToken(nuevoUsuario);

    res.status(201).json({
      success: true,
      message: 'Cooperativa registrada exitosamente',
      data: {
        id: nuevoUsuario.id,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
        razon_social,
        ruc
      },
      token
    });

  } catch (error) {
    console.error('Error al registrar cooperativa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Login universal
const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Buscar usuario con sus datos específicos
    const usuario = await Usuario.findOne({
      where: { correo },
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
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar estado del usuario según su rol
    if (usuario.rol === 'final') {
      if (!usuario.UsuarioFinal) {
        return res.status(400).json({
          success: false,
          message: 'Datos de usuario incompletos'
        });
      }
      // Los usuarios finales no tienen validación de estado
    } else if (usuario.rol === 'cooperativa') {
      if (!usuario.UsuarioCooperativa) {
        return res.status(400).json({
          success: false,
          message: 'Datos de cooperativa incompletos'
        });
      }
      
      if (usuario.UsuarioCooperativa.estado !== 'activo') {
        return res.status(403).json({
          success: false,
          message: 'Su cooperativa se encuentra inactiva. El administrador debe activar su ingreso para poder acceder al sistema.'
        });
      }
    } else if (usuario.rol === 'superuser') {
      // Los superusuarios no necesitan validación de estado específica
      // pero deben tener datos en UsuarioFinal
      if (!usuario.UsuarioFinal) {
        return res.status(400).json({
          success: false,
          message: 'Datos de superusuario incompletos'
        });
      }
    }

    // Generar token
    const token = generateToken(usuario);

    // Preparar datos de respuesta según el rol
    let datosUsuario = {
      id: usuario.id,
      correo: usuario.correo,
      telefono: usuario.telefono,
      rol: usuario.rol
    };

    if (usuario.rol === 'final' && usuario.UsuarioFinal) {
      datosUsuario = {
        ...datosUsuario,
        nombres: usuario.UsuarioFinal.nombres,
        apellidos: usuario.UsuarioFinal.apellidos,
        cedula: usuario.UsuarioFinal.cedula,
        ciudad: usuario.UsuarioFinal.ciudad
        // No incluimos estado para usuarios finales
      };
    } else if (usuario.rol === 'cooperativa' && usuario.UsuarioCooperativa) {
      datosUsuario = {
        ...datosUsuario,
        razon_social: usuario.UsuarioCooperativa.razon_social,
        ruc: usuario.UsuarioCooperativa.ruc,
        permiso_operacion: usuario.UsuarioCooperativa.permiso_operacion,
        estado: usuario.UsuarioCooperativa.estado
      };
    }

    // Configurar dashboard según el rol
    let configuracion = {};
    if (usuario.rol === 'final') {
      configuracion = { dashboard: 'usuario' };
    } else if (usuario.rol === 'cooperativa') {
      configuracion = { dashboard: 'cooperativa' };
    } else if (usuario.rol === 'superuser') {
      configuracion = { dashboard: 'superuser' };
    }

    res.json({
      success: true,
      message: 'Login exitoso',
      usuario: datosUsuario,
      token,
      configuracion
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener perfil del usuario
const obtenerPerfil = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const usuario = await Usuario.findByPk(usuarioId, {
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
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar perfil
const actualizarPerfil = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const datosActualizacion = req.body;

    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar datos comunes
    const { telefono, ...datosPerfil } = datosActualizacion;
    if (telefono) {
      await usuario.update({ telefono });
    }

    // Actualizar datos específicos según el rol
    if (usuario.rol === 'usuario') {
      const usuarioFinal = await UsuarioFinal.findOne({ where: { usuario_id: usuarioId } });
      if (usuarioFinal) {
        await usuarioFinal.update(datosPerfil);
      }
    } else if (usuario.rol === 'cooperativa') {
      const usuarioCooperativa = await UsuarioCooperativa.findOne({ where: { usuario_id: usuarioId } });
      if (usuarioCooperativa) {
        await usuarioCooperativa.update(datosPerfil);
      }
    }

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  registrarUsuario,
  registrarCooperativa,
  login,
  obtenerPerfil,
  actualizarPerfil
};
