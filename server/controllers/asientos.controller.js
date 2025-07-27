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

    const asientosOcupados = await ViajeAsiento.findAll({
      where: { viaje_id: viajeId }
    });

    // Extraer solo los IDs de los asientos ocupados
    const asientosIds = asientosOcupados.map(va => va.asiento_id);

    res.json({
      success: true,
      data: asientosIds
    });
  } catch (error) {
    console.error('Error al obtener asientos ocupados:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
