const { Viaje, Ruta, Unidad, Ciudad, Terminal, UsuarioCooperativa, ViajeAsiento } =  require('../models');

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

// Obtener viajes vigentes (no expirados) por cooperativa
module.exports.getViajesVigentesByCooperativa = async (req, res) => {
  try {
    const { cooperativaId } = req.params;
    const { page = 1, limit = 4 } = req.query; // Parámetros de paginación
    
    if (!cooperativaId) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la cooperativa es requerido'
      });
    }

    // Convertir a números
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    // Obtener todos los viajes de la cooperativa con sus rutas (sin paginación inicial)
    const todosLosViajes = await Viaje.findAll({
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

    // Filtrar viajes vigentes combinando fecha_salida + hora_salida de la ruta
    const ahora = new Date();
    const viajesVigentes = todosLosViajes.filter(viaje => {
      if (!viaje.fecha_salida || !viaje.ruta?.hora_salida) {
        return false; // Si no tiene fecha o hora, no es válido
      }

      // Combinar fecha_salida del viaje con hora_salida de la ruta
      const fechaViaje = new Date(viaje.fecha_salida);
      const [hora, minutos] = viaje.ruta.hora_salida.split(':');
      fechaViaje.setHours(parseInt(hora), parseInt(minutos), 0, 0);

      return fechaViaje > ahora; // Solo viajes futuros
    });

    // Aplicar paginación a los viajes vigentes
    const totalViajesVigentes = viajesVigentes.length;
    const totalPaginas = Math.ceil(totalViajesVigentes / limitNumber);
    const viajesPaginados = viajesVigentes.slice(offset, offset + limitNumber);

    console.log(`📄 Paginación - Página: ${pageNumber}, Límite: ${limitNumber}, Offset: ${offset}`);
    console.log(`📊 Total viajes vigentes: ${totalViajesVigentes}, Total páginas: ${totalPaginas}`);
    console.log(`📋 Viajes en esta página: ${viajesPaginados.length}`);

    res.status(200).json({
      success: true,
      message: `Viajes vigentes encontrados para la cooperativa ${cooperativaId}`,
      data: viajesPaginados,
      pagination: {
        currentPage: pageNumber,
        totalPages: totalPaginas,
        totalItems: totalViajesVigentes,
        itemsPerPage: limitNumber,
        hasNextPage: pageNumber < totalPaginas,
        hasPrevPage: pageNumber > 1
      }
    });
    
  } catch (error) {
    console.error('Error al obtener los viajes vigentes de la cooperativa:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los viajes vigentes de la cooperativa',
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

// Obtener viaje por ID con todas las relaciones
module.exports.getViajeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'El ID del viaje es requerido'
      });
    }

    const viaje = await Viaje.findByPk(id, {
      include: [
        {
          model: Ruta,
          as: 'ruta',
          include: [
            {
              model: Terminal,
              as: 'terminalOrigen',
              include: [
                {
                  model: Ciudad,
                  as: 'ciudad'
                }
              ]
            },
            {
              model: Terminal,
              as: 'terminalDestino',
              include: [
                {
                  model: Ciudad,
                  as: 'ciudad'
                }
              ]
            },
            {
              model: UsuarioCooperativa,
              as: 'UsuarioCooperativa'
            }
          ]
        },
        {
          model: Unidad,
          as: 'unidad'
        }
      ]
    });

    if (!viaje) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: viaje
    });

  } catch (error) {
    console.error('Error al obtener el viaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el viaje',
      error: error.message
    });
  }
};

// Obtener asientos ocupados por viaje
module.exports.getAsientosOcupados = async (req, res) => {
  try {
    const { id } = req.params;

    const asientosOcupados = await ViajeAsiento.findAll({
      where: { viaje_id: id },
      attributes: ['asiento_id']
    });

    const asientosIds = asientosOcupados.map(asiento => asiento.asiento_id);

    res.status(200).json({
      success: true,
      data: {
        viajeId: id,
        asientosOcupados: asientosIds,
        totalAsientosOcupados: asientosIds.length
      }
    });

  } catch (error) {
    console.error('Error al obtener asientos ocupados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener asientos ocupados',
      error: error.message
    });
  }
};

// Obtener viajes vigentes para usuarios (filtrados por origen y destino)
module.exports.getViajesVigentesParaUsuarios = async (req, res) => {
  try {
    const { origenCiudad, destinoCiudad } = req.query;
    
    if (!origenCiudad || !destinoCiudad) {
      return res.status(400).json({
        success: false,
        message: 'Los parámetros origenCiudad y destinoCiudad son requeridos'
      });
    }

    // Obtener todos los viajes que coincidan con origen y destino
    const viajes = await Viaje.findAll({
      include: [
        { 
          model: Ruta, 
          as: 'ruta',
          include: [
            { 
              model: Terminal, 
              as: 'terminalOrigen',
              include: [{ 
                model: Ciudad, 
                as: 'ciudad',
                where: { nombre: origenCiudad }
              }]
            },
            { 
              model: Terminal, 
              as: 'terminalDestino',
              include: [{ 
                model: Ciudad, 
                as: 'ciudad',
                where: { nombre: destinoCiudad }
              }]
            },
            {
              model: UsuarioCooperativa,
              as: 'UsuarioCooperativa'
            }
          ]
        },
        { 
          model: Unidad, 
          as: 'unidad'
        }
      ]
    });

    // Filtrar viajes vigentes combinando fecha_salida + hora_salida de la ruta
    const ahora = new Date();
    const viajesVigentes = viajes.filter(viaje => {
      if (!viaje.fecha_salida || !viaje.ruta?.hora_salida) {
        return false; // Si no tiene fecha o hora, no es válido
      }

      // Combinar fecha_salida del viaje con hora_salida de la ruta
      const fechaViaje = new Date(viaje.fecha_salida);
      const [hora, minutos] = viaje.ruta.hora_salida.split(':');
      fechaViaje.setHours(parseInt(hora), parseInt(minutos), 0, 0);

      return fechaViaje > ahora; // Solo viajes futuros
    });

    // Transformar los datos al formato esperado por el frontend
    const viajesTransformados = viajesVigentes.map(viaje => ({
      id: viaje.id,
      origenCiudad: viaje.ruta?.terminalOrigen?.ciudad?.nombre || origenCiudad,
      origenTerminal: viaje.ruta?.terminalOrigen?.nombre || '',
      destinoCiudad: viaje.ruta?.terminalDestino?.ciudad?.nombre || destinoCiudad,
      destinoTerminal: viaje.ruta?.terminalDestino?.nombre || '',
      horaSalida: viaje.ruta?.hora_salida || '',
      horaLlegada: viaje.ruta?.hora_llegada || '',
      empresa: viaje.ruta?.UsuarioCooperativa?.razon_social || 'Sin asignar',
      precio: parseFloat(viaje.precio) || 0,
      fecha_salida: viaje.fecha_salida,
      fecha_llegada: viaje.fecha_llegada
    }));

    res.status(200).json(viajesTransformados);
    
  } catch (error) {
    console.error('Error al obtener los viajes vigentes para usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los viajes vigentes para usuarios',
      error: error.message
    });
  }
};

// Obtener todos los viajes por fecha_salida
module.exports.getViajesByFechaSalida = async (req, res) => {
  try {
    const { fecha_salida } = req.params;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 4;
    const orden = req.query.orden || '';
    const terminalOrigen = req.query.terminalOrigen;
    const terminalDestino = req.query.terminalDestino;
    const viajeId = req.query.viajeId;
    const offset = (page - 1) * size;
    const limit = size;

    const { Op } = require('sequelize');
    const inicioDia = new Date(fecha_salida + 'T00:00:00.000Z');
    const finDia = new Date(fecha_salida + 'T23:59:59.999Z');

    // Filtros dinámicos
    let where = {
      fecha_salida: {
        [Op.between]: [inicioDia, finDia]
      }
    };

    let rutaWhere = {};
    if (terminalOrigen) rutaWhere.terminal_origen_id = terminalOrigen;
    if (terminalDestino) rutaWhere.terminal_destino_id = terminalDestino;

    // Orden dinámico
    let order = [];
    if (orden === 'precio') {
      order = [['precio', 'ASC']];
    } else if (orden === 'hora') {
      order = [[{ model: Ruta, as: 'ruta' }, 'hora_salida', 'ASC']];
    }

    // Consulta principal (paginada)
    const viajes = await Viaje.findAll({
      where,
      include: [
        {
          model: Ruta,
          as: 'ruta',
          where: rutaWhere,
          include: [
            { model: UsuarioCooperativa, as: 'UsuarioCooperativa' },
            { model: Terminal, as: 'terminalOrigen', include: [{ model: Ciudad, as: 'ciudad' }] },
            { model: Terminal, as: 'terminalDestino', include: [{ model: Ciudad, as: 'ciudad' }] }
          ]
        },
        { model: Unidad, as: 'unidad' }
      ],
      offset,
      limit,
      order
    });

    // Si hay viajeId y no está en la lista, agrégalo
    let viajeExtra = null;
    if (viajeId && !viajes.some(v => v.id === Number(viajeId))) {
      viajeExtra = await Viaje.findOne({
        where: { id: viajeId },
        include: [
          {
            model: Ruta,
            as: 'ruta',
            include: [
              { model: UsuarioCooperativa, as: 'UsuarioCooperativa' },
              { model: Terminal, as: 'terminalOrigen', include: [{ model: Ciudad, as: 'ciudad' }] },
              { model: Terminal, as: 'terminalDestino', include: [{ model: Ciudad, as: 'ciudad' }] }
            ]
          },
          { model: Unidad, as: 'unidad' }
        ]
      });
    }

    let viajesFinal = viajes;
    if (viajeExtra) {
      viajesFinal = [viajeExtra, ...viajes];
    }

    // Total de viajes sin paginación
    const totalViajes = await Viaje.count({
      where,
      include: [
        {
          model: Ruta,
          as: 'ruta',
          where: rutaWhere
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: viajesFinal,
      total: totalViajes,
      page,
      size
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener viajes por fecha_salida',
      error: error.message
    });
  }
};


// Obtener precio mínimo de viajes vigentes
module.exports.getPrecioMinimo = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    // 1. Buscar el precio mínimo
    const minResult = await Viaje.findOne({
      where: { precio: { [Op.gt]: 0 } },
      order: [['precio', 'ASC']],
      attributes: ['precio'],
    });

    if (!minResult) {
      return res.json({
        success: true,
        precioMinimo: 8.00,
        mensaje: 'No hay viajes disponibles, mostrando precio base',
        data: []
      });
    }

    const precioMinimo = minResult.precio;

    // 2. Buscar todos los viajes con ese precio mínimo
    const viajesMinimos = await Viaje.findAll({
      where: { precio: precioMinimo },
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
            },
            {
              model: UsuarioCooperativa,
              as: 'UsuarioCooperativa'
            }
          ]
        },
        {
          model: Unidad,
          as: 'unidad'
        }
      ],
      order: [['precio', 'ASC']]
    });

    res.json({
      success: true,
      precioMinimo: parseFloat(precioMinimo),
      mensaje: 'Viajes con precio mínimo obtenidos correctamente',
      data: viajesMinimos
    });

  } catch (error) {
    console.error('Error al obtener precio mínimo:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      precioMinimo: 8.00,
      mensaje: 'Error al consultar precios, mostrando precio base',
      data: []
    });
  }
};