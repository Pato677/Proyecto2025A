const { Cooperativa, Conductor, Unidad } = require('../models');

// Obtener todas las cooperativas
const getAllCooperativas = async (req, res) => {
    try {
        const cooperativas = await Cooperativa.findAll({
            include: [
                {
                    model: Conductor,
                    as: 'conductores',
                    attributes: ['id', 'nombre', 'roles']
                },
                {
                    model: Unidad,
                    as: 'unidades',
                    attributes: ['id', 'placa', 'numeroUnidad']
                }
            ]
        });
        res.json(cooperativas);
    } catch (error) {
        console.error('Error al obtener cooperativas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener cooperativa por ID
const getCooperativaById = async (req, res) => {
    try {
        const { id } = req.params;
        const cooperativa = await Cooperativa.findByPk(id, {
            include: [
                {
                    model: Conductor,
                    as: 'conductores',
                    attributes: ['id', 'nombre', 'roles', 'telefono', 'correo']
                },
                {
                    model: Unidad,
                    as: 'unidades',
                    attributes: ['id', 'placa', 'numeroUnidad', 'asientos', 'estado']
                }
            ]
        });
        
        if (!cooperativa) {
            return res.status(404).json({ error: 'Cooperativa no encontrada' });
        }
        
        res.json(cooperativa);
    } catch (error) {
        console.error('Error al obtener cooperativa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear nueva cooperativa
const createCooperativa = async (req, res) => {
    try {
        const { id, razonSocial, permisoOperacion, ruc, correo, telefono, contrasena } = req.body;
        
        const nuevaCooperativa = await Cooperativa.create({
            id,
            razonSocial,
            permisoOperacion,
            ruc,
            correo,
            telefono,
            contrasena,
            estado: 'pendiente'
        });
        
        res.status(201).json(nuevaCooperativa);
    } catch (error) {
        console.error('Error al crear cooperativa:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Actualizar cooperativa
const updateCooperativa = async (req, res) => {
    try {
        const { id } = req.params;
        const { razonSocial, permisoOperacion, ruc, correo, telefono, contrasena, estado } = req.body;
        
        const cooperativa = await Cooperativa.findByPk(id);
        if (!cooperativa) {
            return res.status(404).json({ error: 'Cooperativa no encontrada' });
        }
        
        await cooperativa.update({
            razonSocial,
            permisoOperacion,
            ruc,
            correo,
            telefono,
            contrasena,
            estado
        });
        
        res.json(cooperativa);
    } catch (error) {
        console.error('Error al actualizar cooperativa:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Eliminar cooperativa
const deleteCooperativa = async (req, res) => {
    try {
        const { id } = req.params;
        
        const cooperativa = await Cooperativa.findByPk(id);
        if (!cooperativa) {
            return res.status(404).json({ error: 'Cooperativa no encontrada' });
        }
        
        await cooperativa.destroy();
        res.json({ message: 'Cooperativa eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar cooperativa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllCooperativas,
    getCooperativaById,
    createCooperativa,
    updateCooperativa,
    deleteCooperativa
};