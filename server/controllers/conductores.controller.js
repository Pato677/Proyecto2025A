const { Conductor, Cooperativa } = require('../models');

// Obtener todos los conductores
const getAllConductores = async (req, res) => {
    try {
        const conductores = await Conductor.findAll({
            include: [
                {
                    model: Cooperativa,
                    as: 'cooperativa',
                    attributes: ['id', 'razonSocial']
                }
            ]
        });
        res.json(conductores);
    } catch (error) {
        console.error('Error al obtener conductores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener conductor por ID
const getConductorById = async (req, res) => {
    try {
        const { id } = req.params;
        const conductor = await Conductor.findByPk(id, {
            include: [
                {
                    model: Cooperativa,
                    as: 'cooperativa',
                    attributes: ['id', 'razonSocial']
                }
            ]
        });
        
        if (!conductor) {
            return res.status(404).json({ error: 'Conductor no encontrado' });
        }
        
        res.json(conductor);
    } catch (error) {
        console.error('Error al obtener conductor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear nuevo conductor
const createConductor = async (req, res) => {
    try {
        const { nombre, identificacion, tipoLicencia, telefono, correo, roles, cooperativaId } = req.body;
        
        const nuevoConductor = await Conductor.create({
            nombre,
            identificacion,
            tipoLicencia,
            telefono,
            correo,
            roles,
            cooperativaId
        });
        
        res.status(201).json(nuevoConductor);
    } catch (error) {
        console.error('Error al crear conductor:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Actualizar conductor
const updateConductor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, identificacion, tipoLicencia, telefono, correo, roles, cooperativaId, estado } = req.body;
        
        const conductor = await Conductor.findByPk(id);
        if (!conductor) {
            return res.status(404).json({ error: 'Conductor no encontrado' });
        }
        
        await conductor.update({
            nombre,
            identificacion,
            tipoLicencia,
            telefono,
            correo,
            roles,
            cooperativaId,
            estado
        });
        
        res.json(conductor);
    } catch (error) {
        console.error('Error al actualizar conductor:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Eliminar conductor
const deleteConductor = async (req, res) => {
    try {
        const { id } = req.params;
        
        const conductor = await Conductor.findByPk(id);
        if (!conductor) {
            return res.status(404).json({ error: 'Conductor no encontrado' });
        }
        
        await conductor.destroy();
        res.json({ message: 'Conductor eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar conductor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllConductores,
    getConductorById,
    createConductor,
    updateConductor,
    deleteConductor
};