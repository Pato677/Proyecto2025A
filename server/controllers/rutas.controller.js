const { Ruta, Terminal, Ciudad, UsuarioCooperativa } = require('../models');

module.exports.getAllRutas = async (req, res) => {
  try {
    const rutas = await Ruta.findAll({
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
    res.status(200).json(rutas);
  } catch (error) {
    console.error('Error al obtener las rutas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las rutas' });
  }
};

// Obtener rutas por cooperativa
module.exports.getRutasByCooperativa = async (req, res) => {
  try {
    const { cooperativaId } = req.params;
    
    if (!cooperativaId) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la cooperativa es requerido'
      });
    }

    const rutas = await Ruta.findAll({
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
    });

    res.status(200).json({
      success: true,
      message: `Rutas encontradas para la cooperativa ${cooperativaId}`,
      data: rutas,
      total: rutas.length
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

