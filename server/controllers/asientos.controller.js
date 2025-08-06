const { Asiento, ViajeAsiento } = require('../models');

// Obtener todos los asientos
module.exports.getAllAsientos = async (req, res) => {
  try {
    const asientos = await Asiento.findAll({
      order: [['numeracion', 'ASC']]
    });

    res.json({
      success: true,
      data: asientos
    });
  } catch (error) {
    console.error('Error al obtener asientos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener asientos ocupados por viaje
module.exports.getAsientosOcupados = async (req, res) => {
  try {
    const { viajeId } = req.params;
    console.log('Buscando asientos ocupados para el viaje:', viajeId);

    // Usar consulta manual directa sin include (más confiable)
    const viajeAsientos = await ViajeAsiento.findAll({
      where: { viaje_id: viajeId }
    });

    console.log('ViajeAsientos encontrados:', viajeAsientos.map(va => ({ id: va.id, viaje_id: va.viaje_id, asiento_id: va.asiento_id })));

    const asientoIds = viajeAsientos.map(va => va.asiento_id);
    console.log('IDs de asientos ocupados:', asientoIds);

    if (asientoIds.length === 0) {
      console.log('No hay asientos ocupados para este viaje');
      return res.json({
        success: true,
        data: []
      });
    }

    // IMPORTANTE: Como Asiento usa 'numeracion' como primary key, buscar por 'numeracion' no por 'id'
    const asientos = await Asiento.findAll({
      where: { numeracion: asientoIds }, // Cambio aquí: usar numeracion en lugar de id
      attributes: ['numeracion']
    });

    console.log('Asientos encontrados:', asientos.map(a => ({ numeracion: a.numeracion })));

    const numeraciones = asientos.map(asiento => asiento.numeracion.toString());
    console.log('Numeraciones finales a devolver:', numeraciones);
    
    res.json({
      success: true,
      data: numeraciones
    });
  } catch (error) {
    console.error('Error al obtener asientos ocupados:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
