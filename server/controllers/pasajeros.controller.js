const { Pasajero, Boleto, Compra } = require('../models');

// Obtener todos los pasajeros
const obtenerPasajeros = async (req, res) => {
  try {
    const pasajeros = await Pasajero.findAll({
      include: [
        {
          model: Boleto,
          attributes: ['codigo', 'valor']
        },
        {
          model: Compra,
          attributes: ['id', 'fecha', 'email_contacto', 'telefono_contacto']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: pasajeros
    });
  } catch (error) {
    console.error('Error al obtener pasajeros:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    });
  }
};

// Obtener pasajero por ID
const obtenerPasajeroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pasajero = await Pasajero.findByPk(id, {
      include: [
        {
          model: Boleto,
          attributes: ['codigo', 'valor']
        },
        {
          model: Compra,
          attributes: ['id', 'fecha', 'email_contacto', 'telefono_contacto']
        }
      ]
    });

    if (!pasajero) {
      return res.status(404).json({
        error: 'Pasajero no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: pasajero
    });
  } catch (error) {
    console.error('Error al obtener pasajero:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    });
  }
};

// Buscar pasajero por cédula
const buscarPasajeroPorCedula = async (req, res) => {
  try {
    const { cedula } = req.params;
    
    const pasajero = await Pasajero.findOne({
      where: { cedula },
      include: [
        {
          model: Boleto,
          attributes: ['codigo', 'valor']
        },
        {
          model: Compra,
          attributes: ['id', 'fecha', 'email_contacto', 'telefono_contacto']
        }
      ]
    });

    if (!pasajero) {
      return res.status(404).json({
        error: 'Pasajero no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: pasajero
    });
  } catch (error) {
    console.error('Error al buscar pasajero:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    });
  }
};

// Crear pasajero individual (para casos especiales)
const crearPasajero = async (req, res) => {
  try {
    const { nombres, apellidos, fecha_nacimiento, cedula } = req.body;

    // Validaciones
    if (!nombres || !apellidos || !fecha_nacimiento || !cedula) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      });
    }

    // Verificar si ya existe un pasajero con esa cédula
    const pasajeroExistente = await Pasajero.findOne({ where: { cedula } });
    if (pasajeroExistente) {
      return res.status(400).json({
        error: 'Ya existe un pasajero con esta cédula'
      });
    }

    const nuevoPasajero = await Pasajero.create({
      nombres,
      apellidos,
      fecha_nacimiento,
      cedula
    });

    res.status(201).json({
      success: true,
      message: 'Pasajero creado exitosamente',
      data: nuevoPasajero
    });
  } catch (error) {
    console.error('Error al crear pasajero:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    });
  }
};

module.exports = {
  obtenerPasajeros,
  obtenerPasajeroPorId,
  buscarPasajeroPorCedula,
  crearPasajero
};
