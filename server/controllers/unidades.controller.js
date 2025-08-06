const { Unidad, Conductor, UsuarioCooperativa } =  require('../models');

// Obtener todas las unidades
const getAllUnidades = async (req, res) => {
    try {
        const unidades = await Unidad.findAll({
            include: [
                {
                    model: Conductor,
                    as: 'Conductor',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Conductor,
                    as: 'Controlador',
                    attributes: ['id', 'nombre']
                },
                {
                    model: UsuarioCooperativa,
                    foreignKey: 'cooperativa_id',
                    attributes: ['id', 'razonSocial']
                }
            ]
        });
        res.json(unidades);
    } catch (error) {
        console.error('Error al obtener unidades:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener unidad por ID por cooperativa
const getUnidadById = async (req, res) => {
    try {
        const { id } = req.params;
        const unidad = await Unidad.findByPk(id, {
            include: [
                {
                    model: Conductor,
                    as: 'Conductor',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Conductor,
                    as: 'Controlador',
                    attributes: ['id', 'nombre']
                },
                {
                    model: UsuarioCooperativa,
                    foreignKey: 'cooperativa_id',
                    attributes: ['id', 'razonSocial']
                }
            ]
        });
        
        if (!unidad) {
            return res.status(404).json({ error: 'Unidad no encontrada' });
        }
        
        res.json(unidad);
    } catch (error) {
        console.error('Error al obtener unidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear nueva unidad para una cooperativa específica
const createUnidad = async (req, res) => {
    /*try {
        const { placa, numeroUnidad, pisos, asientos, imagen, cooperativaId, conductorId, controladorId } = req.body;
        
        const nuevaUnidad = await Unidad.create({
            placa,
            numeroUnidad,
            pisos,
            asientos,
            imagen,
            cooperativaId,
            conductorId,
            controladorId
        });
        
        res.status(201).json(nuevaUnidad);
    } catch (error) {
        console.error('Error al crear unidad:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }*/
    try {
        const { placa, numeroUnidad, imagen, cooperativaId, conductorId, controladorId } = req.body;
        
        // Validar que todos los campos requeridos estén presentes
        if (!placa || !numeroUnidad || !cooperativaId || !conductorId || !controladorId) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        
        const nuevaUnidad = await Unidad.create({
            placa,
            numero_unidad: numeroUnidad,
            imagen_path: imagen,
            cooperativa_id: cooperativaId,
            conductor_id: conductorId,
            controlador_id: controladorId
        });
        
        res.status(201).json(nuevaUnidad);
    } catch (error) {
        console.error('Error al crear unidad:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Actualizar unidad POR ID DE UNIDAD
// Se espera que el ID de la unidad se pase como parámetro en la URL
const updateUnidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { placa, numeroUnidad, imagen, cooperativaId, conductorId, controladorId } = req.body;

    const unidad = await Unidad.findByPk(id);
    if (!unidad) {
      return res.status(404).json({ error: 'Unidad no encontrada' });
    }

    await unidad.update({
      placa,
      numero_unidad: numeroUnidad,
      imagen_path: imagen,
      cooperativa_id: cooperativaId,
      conductor_id: conductorId,
      controlador_id: controladorId
    });

    res.json(unidad);
  } catch (error) {
    console.error('Error al actualizar unidad:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};


// Eliminar unidad
const deleteUnidad = async (req, res) => {
    try {
        const { id } = req.params;
        
        const unidad = await Unidad.findByPk(id);
        if (!unidad) {
            return res.status(404).json({ error: 'Unidad no encontrada' });
        }
        
        await unidad.destroy();
        res.json({ message: 'Unidad eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar unidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener unidades por cooperativa
const getUnidadesByCooperativa = async (req, res) => {
    try {
        const { cooperativaId } = req.params;
        
        if (!cooperativaId) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la cooperativa es requerido'
            });
        }

        const unidades = await Unidad.findAll({
            where: { cooperativa_id: cooperativaId },
            include: [
                {
                    model: Conductor,
                    as: 'Conductor',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Conductor,
                    as: 'Controlador',
                    attributes: ['id', 'nombre']
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: `Unidades encontradas para la cooperativa ${cooperativaId}`,
            data: unidades,
            total: unidades.length
        });
        
    } catch (error) {
        console.error('Error al obtener unidades por cooperativa:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener unidades por cooperativa',
            error: error.message 
        });
    }
};

module.exports = {
    getAllUnidades,
    getUnidadById,
    createUnidad,
    updateUnidad,
    deleteUnidad,
    getUnidadesByCooperativa
};