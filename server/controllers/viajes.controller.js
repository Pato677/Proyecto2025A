const { Viaje, Ruta, Unidad, Ciudad, Terminal, UsuarioCooperativa } =  require('../models');

// Crear nuevo viaje
module.exports.createViaje = async (req, res) => {
  try {
    const { fecha_salida, fecha_llegada, numero_asientos_ocupados, precio, ruta_id, unidad_id } = req.body;
    
    // Validaciones básicas
    if (!fecha_salida || precio === undefined || precio === null || !ruta_id) {
      return res.status(400).json({
        success: false,
        message: 'Los campos fecha_salida, precio y ruta_id son obligatorios'
      });
    }

    // Validar que el precio sea válido (puede ser 0)
    if (parseFloat(precio) < 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio no puede ser negativo'
      });
    }

    // Verificar que la ruta existe
    const ruta = await Ruta.findByPk(ruta_id);
    if (!ruta) {
      return res.status(404).json({
        success: false,
        message: 'La ruta especificada no existe'
      });
    }

    // Verificar que la unidad existe (solo si se proporciona)
    if (unidad_id) {
      const unidad = await Unidad.findByPk(unidad_id);
      if (!unidad) {
        return res.status(404).json({
          success: false,
          message: 'La unidad especificada no existe'
        });
      }
    }

    // Crear el viaje
    const nuevoViaje = await Viaje.create({
      fecha_salida,
      fecha_llegada: fecha_llegada || fecha_salida,
      numero_asientos_ocupados: numero_asientos_ocupados || 0,
      precio: parseFloat(precio),
      ruta_id: parseInt(ruta_id),
      unidad_id: unidad_id ? parseInt(unidad_id) : null
    });

    // Obtener el viaje creado con sus relaciones
    const viajeCompleto = await Viaje.findByPk(nuevoViaje.id, {
      include: [
        { 
          model: Ruta, 
          as: 'ruta',
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
            }
          ]
        },
        { 
          model: Unidad, 
          as: 'unidad'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Viaje creado exitosamente',
      data: viajeCompleto
    });
    
  } catch (error) {
    console.error('Error al crear el viaje:', error);
    
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Error de validación',
        error: error.errors.map(e => e.message).join(', ')
      });
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Error de referencia: La ruta o unidad especificada no existe'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear el viaje',
      error: error.message 
    });
  }
};

// Actualizar viaje
module.exports.updateViaje = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_salida, fecha_llegada, numero_asientos_ocupados, precio, ruta_id, unidad_id } = req.body;
    
    // Verificar que el viaje existe
    const viaje = await Viaje.findByPk(id);
    if (!viaje) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }

    // Validaciones básicas (solo si se proporcionan nuevos valores)
    if (precio !== undefined && precio !== null && parseFloat(precio) < 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio no puede ser negativo'
      });
    }

    // Verificar que la ruta existe (solo si se proporciona)
    if (ruta_id) {
      const ruta = await Ruta.findByPk(ruta_id);
      if (!ruta) {
        return res.status(404).json({
          success: false,
          message: 'La ruta especificada no existe'
        });
      }
    }

    // Verificar que la unidad existe (solo si se proporciona)
    if (unidad_id) {
      const unidad = await Unidad.findByPk(unidad_id);
      if (!unidad) {
        return res.status(404).json({
          success: false,
          message: 'La unidad especificada no existe'
        });
      }
    }

    // Actualizar el viaje solo con los campos proporcionados
    const updateData = {};
    if (fecha_salida !== undefined) updateData.fecha_salida = fecha_salida;
    if (fecha_llegada !== undefined) updateData.fecha_llegada = fecha_llegada;
    if (numero_asientos_ocupados !== undefined) updateData.numero_asientos_ocupados = numero_asientos_ocupados || 0;
    if (precio !== undefined && precio !== null) updateData.precio = parseFloat(precio);
    if (ruta_id !== undefined) updateData.ruta_id = parseInt(ruta_id);
    if (unidad_id !== undefined) updateData.unidad_id = unidad_id ? parseInt(unidad_id) : null;

    await viaje.update(updateData);

    // Obtener el viaje actualizado con sus relaciones
    const viajeActualizado = await Viaje.findByPk(id, {
      include: [
        { 
          model: Ruta, 
          as: 'ruta',
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
            }
          ]
        },
        { 
          model: Unidad, 
          as: 'unidad'
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Viaje actualizado exitosamente',
      data: viajeActualizado
    });
    
  } catch (error) {
    console.error('Error al actualizar el viaje:', error);
    
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Error de validación',
        error: error.errors.map(e => e.message).join(', ')
      });
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Error de referencia: La ruta o unidad especificada no existe'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar el viaje',
      error: error.message 
    });
  }
};



module.exports.getViajesByCooperativa = async (req, res) => {
  try {
    const { cooperativaId } = req.params;
    
    if (!cooperativaId) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la cooperativa es requerido'
      });
    }

    const viajes = await Viaje.findAll({
      include: [
        { 
          model: Ruta, 
          as: 'ruta',
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
          ]
        },
        { 
          model: Unidad, 
          as: 'unidad'
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: `Viajes encontrados para la cooperativa ${cooperativaId}`,
      data: viajes,
      total: viajes.length
    });
    
  } catch (error) {
    console.error('Error al obtener los viajes de la cooperativa:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los viajes de la cooperativa',
      error: error.message 
    });
  }
};




module.exports.deleteViaje = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await Viaje.destroy({
      where: { id }
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Viaje eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar el viaje:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar el viaje',
      error: error.message 
    });
  }
};