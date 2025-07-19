const { Unidad, Conductor, Cooperativa } =  require('../models');

// Obtener todas las unidades
const getAllUnidades = async (req, res) => {
    try {
        const unidades = await Unidad.findAll({
            include: [
                {
                    model: Conductor,
                    as: 'conductor',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Conductor,
                    as: 'controlador',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Cooperativa,
                    as: 'cooperativa',
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

// Obtener unidad por ID
const getUnidadById = async (req, res) => {
    try {
        const { id } = req.params;
        const unidad = await Unidad.findByPk(id, {
            include: [
                {
                    model: Conductor,
                    as: 'conductor',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Conductor,
                    as: 'controlador',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Cooperativa,
                    as: 'cooperativa',
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

// Crear nueva unidad
const createUnidad = async (req, res) => {
    try {
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
    }
};

// Actualizar unidad
const updateUnidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { placa, numeroUnidad, pisos, asientos, imagen, cooperativaId, conductorId, controladorId, estado } = req.body;
        
        const unidad = await Unidad.findByPk(id);
        if (!unidad) {
            return res.status(404).json({ error: 'Unidad no encontrada' });
        }
        
        await unidad.update({
            placa,
            numeroUnidad,
            pisos,
            asientos,
            imagen,
            cooperativaId,
            conductorId,
            controladorId,
            estado
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

module.exports = {
    getAllUnidades,
    getUnidadById,
    createUnidad,
    updateUnidad,
    deleteUnidad
};