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
      email, 
      password, 
      telefono, 
      nombres, 
      apellidos, 
      cedula, 
      fecha_nacimiento, 
      genero, 
      direccion, 
      ciudad 
    } = req.body;

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ 
        success: false, 
        message: 'El email ya está registrado' 
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario base
    const nuevoUsuario = await Usuario.create({
      email,
      password: hashedPassword,
      telefono,
      rol: 'usuario',
      estado: 'activo'
    });

    // Crear datos específicos del usuario final
    await UsuarioFinal.create({
      usuario_id: nuevoUsuario.id,
      nombres,
      apellidos,
      cedula,
      fecha_nacimiento,
      genero,
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
        email: nuevoUsuario.email,
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
      email,
      password,
      telefono,
      nombre_cooperativa,
      ruc,
      razon_social,
      representante_legal,
      cedula_representante,
      direccion_matriz,
      ciudad_matriz,
      telefono_fijo,
      pagina_web,
      fecha_constitucion,
      numero_socios
    } = req.body;

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario base
    const nuevoUsuario = await Usuario.create({
      email,
      password: hashedPassword,
      telefono,
      rol: 'cooperativa',
      estado: 'activo'
    });

    // Crear datos específicos de la cooperativa
    await UsuarioCooperativa.create({
      usuario_id: nuevoUsuario.id,
      nombre_cooperativa,
      ruc,
      razon_social,
      representante_legal,
      cedula_representante,
      direccion_matriz,
      ciudad_matriz,
      telefono_fijo,
      pagina_web,
      fecha_constitucion,
      numero_socios: numero_socios || 0,
      estado_juridico: 'en_tramite'
    });

    // Generar token
    const token = generateToken(nuevoUsuario);

    res.status(201).json({
      success: true,
      message: 'Cooperativa registrada exitosamente',
      data: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
        nombre_cooperativa,
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
    const { email, password } = req.body;

    // Buscar usuario con sus datos específicos
    const usuario = await Usuario.findOne({
      where: { email },
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
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar estado del usuario
    if (usuario.estado !== 'activo') {
      return res.status(403).json({
        success: false,
        message: 'Cuenta inactiva o suspendida'
      });
    }

    // Actualizar fecha de último acceso
    await usuario.update({ fecha_ultimo_acceso: new Date() });

    // Generar token
    const token = generateToken(usuario);

    // Preparar datos de respuesta según el rol
    let datosUsuario = {
      id: usuario.id,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: usuario.rol,
      estado: usuario.estado
    };

    if (usuario.rol === 'usuario' && usuario.datosUsuarioFinal) {
      datosUsuario = {
        ...datosUsuario,
        nombres: usuario.datosUsuarioFinal.nombres,
        apellidos: usuario.datosUsuarioFinal.apellidos,
        cedula: usuario.datosUsuarioFinal.cedula,
        ciudad: usuario.datosUsuarioFinal.ciudad,
        puntos_fidelidad: usuario.datosUsuarioFinal.puntos_fidelidad
      };
    } else if (usuario.rol === 'cooperativa' && usuario.datosCooperativa) {
      datosUsuario = {
        ...datosUsuario,
        nombre_cooperativa: usuario.datosCooperativa.nombre_cooperativa,
        ruc: usuario.datosCooperativa.ruc,
        razon_social: usuario.datosCooperativa.razon_social,
        representante_legal: usuario.datosCooperativa.representante_legal,
        estado_juridico: usuario.datosCooperativa.estado_juridico
      };
    }

    res.json({
      success: true,
      message: 'Login exitoso',
      data: datosUsuario,
      token
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
