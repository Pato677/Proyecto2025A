const { Ruta, Terminal, Ciudad, UsuarioCooperativa } = require('../models');

// Obtener todas las rutas con paginación
module.exports.getAllRutas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: rutas } = await Ruta.findAndCountAll({
      include: [
        { 
          model: Terminal, 
          as: 'terminalOrigen',
          include: [{ model: Ciudad, as: 'ciudad' }]
        },
        { 
          model: Terminal, 
          as: 'terminalDestino',
          include: [{ model: Ciudad, as: 'ciudad' }]
        },
        {
          model: UsuarioCooperativa,
          foreignKey: 'cooperativa_id'
        }
      ],
      limit,
      offset,
      order: [['id', 'ASC']]
    });

    // Formatear datos para el frontend
    const rutasFormateadas = rutas.map(ruta => ({
      id: ruta.id,
      numeroRuta: ruta.numero_ruta,
      numero_ruta: ruta.numero_ruta, // Agregar también con underscore para compatibilidad
      ciudadOrigen: ruta.terminalOrigen?.ciudad?.nombre || 'N/A',
      terminalOrigen: ruta.terminalOrigen?.nombre || 'N/A',
      ciudadDestino: ruta.terminalDestino?.ciudad?.nombre || 'N/A',
      terminalDestino: ruta.terminalDestino?.nombre || 'N/A',
      horaSalida: ruta.hora_salida,
      horaLlegada: ruta.hora_llegada,
      hora_salida: ruta.hora_salida, // Agregar también con underscore para compatibilidad
      hora_llegada: ruta.hora_llegada, // Agregar también con underscore para compatibilidad
      paradas: ruta.paradas ? JSON.parse(ruta.paradas) : [],
      cooperativa: ruta.UsuarioCooperativa?.razon_social || 'N/A',
      cooperativa_id: ruta.cooperativa_id, // Agregar el ID de la cooperativa
      UsuarioCooperativa: ruta.UsuarioCooperativa // Mantener la relación completa
    }));

    res.status(200).json({
      success: true,
      data: rutasFormateadas,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error al obtener las rutas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las rutas' });
  }
};

// Obtener rutas por cooperativa
module.exports.getRutasByCooperativa = async (req, res) => {
  try {
    const { cooperativaId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // Aumentar límite por defecto
    const offset = (page - 1) * limit;
    
    console.log(`🔍 Buscando rutas para cooperativa ${cooperativaId} con límite ${limit}`);
    
    if (!cooperativaId) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la cooperativa es requerido'
      });
    }

    const { count, rows: rutas } = await Ruta.findAndCountAll({
      where: { cooperativa_id: cooperativaId },
      include: [
        { 
          model: Terminal, 
          as: 'terminalOrigen',
          include: [{ model: Ciudad, as: 'ciudad' }]
        },
        { 
          model: Terminal, 
          as: 'terminalDestino',
          include: [{ model: Ciudad, as: 'ciudad' }]
        },
        {
          model: UsuarioCooperativa,
          foreignKey: 'cooperativa_id'
        }
      ],
      limit,
      offset,
      order: [['id', 'ASC']]
    });

    console.log(`📊 Total de rutas encontradas para cooperativa ${cooperativaId}: ${count}`);
    console.log(`📋 Rutas devueltas en esta página: ${rutas.length}`);

    // Formatear datos para el frontend
    const rutasFormateadas = rutas.map(ruta => ({
      id: ruta.id,
      numeroRuta: ruta.numero_ruta,
      numero_ruta: ruta.numero_ruta, // Agregar también con underscore para compatibilidad
      ciudadOrigen: ruta.terminalOrigen?.ciudad?.nombre || 'N/A',
      terminalOrigen: ruta.terminalOrigen?.nombre || 'N/A',
      ciudadDestino: ruta.terminalDestino?.ciudad?.nombre || 'N/A',
      terminalDestino: ruta.terminalDestino?.nombre || 'N/A',
      horaSalida: ruta.hora_salida,
      horaLlegada: ruta.hora_llegada,
      hora_salida: ruta.hora_salida, // Agregar también con underscore para compatibilidad
      hora_llegada: ruta.hora_llegada, // Agregar también con underscore para compatibilidad
      paradas: ruta.paradas ? JSON.parse(ruta.paradas) : [],
      cooperativa: ruta.UsuarioCooperativa?.razon_social || 'N/A',
      cooperativa_id: ruta.cooperativa_id, // Agregar el ID de la cooperativa
      UsuarioCooperativa: ruta.UsuarioCooperativa // Mantener la relación completa
    }));

    console.log(`✅ Enviando ${rutasFormateadas.length} rutas formateadas al frontend`);

    res.status(200).json({
      success: true,
      message: `Rutas encontradas para la cooperativa ${cooperativaId}`,
      data: rutasFormateadas,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
    
  } catch (error) {
    console.error('Error al obtener las rutas de la cooperativa:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las rutas de la cooperativa',
      error: error.message 
    });
  }
};

// Obtener ruta por ID
module.exports.getRutaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ruta = await Ruta.findByPk(id, {
      include: [
        { 
          model: Terminal, 
          as: 'terminalOrigen',
          include: [{ model: Ciudad, as: 'ciudad' }]
        },
        { 
          model: Terminal, 
          as: 'terminalDestino',
          include: [{ model: Ciudad, as: 'ciudad' }]
        },
        {
          model: UsuarioCooperativa,
          foreignKey: 'cooperativa_id'
        }
      ]
    });

    if (!ruta) {
      return res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
      });
    }

    // Formatear para el frontend
    const rutaFormateada = {
      id: ruta.id,
      numeroRuta: ruta.numero_ruta,
      ciudadOrigen: ruta.terminalOrigen?.ciudad?.nombre || 'N/A',
      terminalOrigen: ruta.terminalOrigen?.nombre || 'N/A',
      ciudadDestino: ruta.terminalDestino?.ciudad?.nombre || 'N/A',
      terminalDestino: ruta.terminalDestino?.nombre || 'N/A',
      horaSalida: ruta.hora_salida,
      horaLlegada: ruta.hora_llegada,
      paradas: ruta.paradas ? JSON.parse(ruta.paradas) : [],
      cooperativa: ruta.UsuarioCooperativa?.razon_social || 'N/A'
    };

    res.status(200).json({
      success: true,
      data: rutaFormateada
    });
    
  } catch (error) {
    console.error('Error al obtener la ruta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la ruta',
      error: error.message 
    });
  }
};

// Crear nueva ruta
module.exports.createRuta = async (req, res) => {
  try {
    const { 
      numeroRuta, 
      terminalOrigenId, 
      terminalDestinoId, 
      horaSalida, 
      horaLlegada, 
      cooperativaId 
    } = req.body;

    // Validaciones básicas
    if (!numeroRuta || !terminalOrigenId || !terminalDestinoId || !horaSalida || !horaLlegada || !cooperativaId) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar que la cooperativa existe
    const cooperativa = await UsuarioCooperativa.findByPk(cooperativaId);
    if (!cooperativa) {
      return res.status(400).json({
        success: false,
        message: `La cooperativa con ID ${cooperativaId} no existe`
      });
    }

    // Verificar que los terminales existan
    const terminalOrigen = await Terminal.findByPk(terminalOrigenId);
    const terminalDestino = await Terminal.findByPk(terminalDestinoId);

    if (!terminalOrigen || !terminalDestino) {
      return res.status(400).json({
        success: false,
        message: 'Los terminales especificados no existen'
      });
    }

    // Crear la ruta SIN paradas (se añaden después)
    const nuevaRuta = await Ruta.create({
      numero_ruta: numeroRuta,
      terminal_origen_id: terminalOrigenId,
      terminal_destino_id: terminalDestinoId,
      hora_salida: horaSalida,
      hora_llegada: horaLlegada,
      paradas: JSON.stringify([]), // Array vacío inicialmente
      cooperativa_id: cooperativaId
    });

    // Obtener la ruta creada con sus relaciones
    const rutaCompleta = await Ruta.findByPk(nuevaRuta.id, {
      include: [
        { 
          model: Terminal, 
          as: 'terminalOrigen',
          include: [{ model: Ciudad, as: 'ciudad' }]
        },
        { 
          model: Terminal, 
          as: 'terminalDestino',
          include: [{ model: Ciudad, as: 'ciudad' }]
        },
        {
          model: UsuarioCooperativa,
          foreignKey: 'cooperativa_id'
        }
      ]
    });

    // Formatear para el frontend
    const rutaFormateada = {
      id: rutaCompleta.id,
      numeroRuta: rutaCompleta.numero_ruta,
      ciudadOrigen: rutaCompleta.terminalOrigen?.ciudad?.nombre || 'N/A',
      terminalOrigen: rutaCompleta.terminalOrigen?.nombre || 'N/A',
      ciudadDestino: rutaCompleta.terminalDestino?.ciudad?.nombre || 'N/A',
      terminalDestino: rutaCompleta.terminalDestino?.nombre || 'N/A',
      horaSalida: rutaCompleta.hora_salida,
      horaLlegada: rutaCompleta.hora_llegada,
      paradas: rutaCompleta.paradas ? JSON.parse(rutaCompleta.paradas) : [],
      cooperativa: rutaCompleta.UsuarioCooperativa?.razon_social || 'N/A'
    };

    res.status(201).json({
      success: true,
      message: 'Ruta creada exitosamente',
      data: rutaFormateada
    });

  } catch (error) {
    console.error('Error al crear la ruta:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ 
        success: false, 
        message: 'Error de validación',
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  }
};

// Actualizar ruta
module.exports.updateRuta = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      numeroRuta, 
      terminalOrigenId, 
      terminalDestinoId, 
      horaSalida, 
      horaLlegada, 
      paradas 
    } = req.body;

    const ruta = await Ruta.findByPk(id);
    if (!ruta) {
      return res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
      });
    }

    // Actualizar la ruta
    await ruta.update({
      numero_ruta: numeroRuta || ruta.numero_ruta,
      terminal_origen_id: terminalOrigenId || ruta.terminal_origen_id,
      terminal_destino_id: terminalDestinoId || ruta.terminal_destino_id,
      hora_salida: horaSalida || ruta.hora_salida,
      hora_llegada: horaLlegada || ruta.hora_llegada,
      paradas: paradas ? (Array.isArray(paradas) ? JSON.stringify(paradas) : paradas) : ruta.paradas
    });

    // Obtener la ruta actualizada con sus relaciones
    const rutaActualizada = await Ruta.findByPk(id, {
      include: [
        { 
          model: Terminal, 
          as: 'terminalOrigen',
          include: [{ model: Ciudad, as: 'ciudad' }]
        },
        { 
          model: Terminal, 
          as: 'terminalDestino',
          include: [{ model: Ciudad, as: 'ciudad' }]
        },
        {
          model: UsuarioCooperativa,
          foreignKey: 'cooperativa_id'
        }
      ]
    });

    // Formatear para el frontend
    const rutaFormateada = {
      id: rutaActualizada.id,
      numeroRuta: rutaActualizada.numero_ruta,
      ciudadOrigen: rutaActualizada.terminalOrigen?.ciudad?.nombre || 'N/A',
      terminalOrigen: rutaActualizada.terminalOrigen?.nombre || 'N/A',
      ciudadDestino: rutaActualizada.terminalDestino?.ciudad?.nombre || 'N/A',
      terminalDestino: rutaActualizada.terminalDestino?.nombre || 'N/A',
      horaSalida: rutaActualizada.hora_salida,
      horaLlegada: rutaActualizada.hora_llegada,
      paradas: rutaActualizada.paradas ? JSON.parse(rutaActualizada.paradas) : [],
      cooperativa: rutaActualizada.UsuarioCooperativa?.razon_social || 'N/A'
    };

    res.status(200).json({
      success: true,
      message: 'Ruta actualizada exitosamente',
      data: rutaFormateada
    });

  } catch (error) {
    console.error('Error al actualizar la ruta:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ 
        success: false, 
        message: 'Error de validación',
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  }
};

// Eliminar ruta
module.exports.deleteRuta = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ruta = await Ruta.findByPk(id);
    if (!ruta) {
      return res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
      });
    }

    await ruta.destroy();

    res.status(200).json({
      success: true,
      message: 'Ruta eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar la ruta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
};

// Actualizar solo las paradas de una ruta
module.exports.updateParadas = async (req, res) => {
  try {
    const { id } = req.params;
    const { paradas } = req.body;

    const ruta = await Ruta.findByPk(id);
    if (!ruta) {
      return res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
      });
    }

    // Actualizar las paradas (array de strings)
    await ruta.update({
      paradas: Array.isArray(paradas) ? JSON.stringify(paradas) : paradas
    });

    res.status(200).json({
      success: true,
      message: 'Paradas actualizadas exitosamente',
      data: {
        id: ruta.id,
        paradas: Array.isArray(paradas) ? paradas : JSON.parse(paradas || '[]')
      }
    });

  } catch (error) {
    console.error('Error al actualizar las paradas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
};

// Obtener cooperativas disponibles
module.exports.getCooperativas = async (req, res) => {
  try {
    const cooperativas = await UsuarioCooperativa.findAll({
      attributes: ['id', 'razon_social', 'ruc'],
      order: [['razon_social', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: cooperativas
    });

  } catch (error) {
    console.error('Error al obtener las cooperativas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
};

// Obtener terminales disponibles para usar como paradas
module.exports.getTerminalesParaParadas = async (req, res) => {
  try {
    const terminales = await Terminal.findAll({
      include: [{ model: Ciudad, as: 'ciudad' }],
      order: [['nombre', 'ASC']]
    });

    const terminalesFormateados = terminales.map(terminal => ({
      id: terminal.id,
      nombre: terminal.nombre,
      direccion: terminal.direccion,
      ciudad: terminal.ciudad?.nombre || 'N/A',
      label: `${terminal.nombre} - ${terminal.ciudad?.nombre || 'N/A'}` // Para mostrar en select
    }));

    res.status(200).json({
      success: true,
      data: terminalesFormateados
    });

  } catch (error) {
    console.error('Error al obtener terminales:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
};

