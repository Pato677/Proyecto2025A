const { Ciudad, Terminal } = require('../models');

// Obtener todas las ciudades
const getAllCiudades = async (req, res) => {
    try {
        const ciudades = await Ciudad.findAll({
            include: [
                {
                    model: Terminal,
                    as: 'terminales',
                    attributes: ['id', 'nombre', 'direccion']
                }
            ]
        });
        res.json(ciudades);
    } catch (error) {
        console.error('Error al obtener ciudades:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener ciudad por ID
const getCiudadById = async (req, res) => {
    try {
        const { id } = req.params;
        const ciudad = await Ciudad.findByPk(id, {
            include: [
                {
                    model: Terminal,
                    as: 'terminales',
                    attributes: ['id', 'nombre', 'direccion']
                }
            ]
        });
        
        if (!ciudad) {
            return res.status(404).json({ error: 'Ciudad no encontrada' });
        }
        
        res.json(ciudad);
    } catch (error) {
        console.error('Error al obtener ciudad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear nueva ciudad
const createCiudad = async (req, res) => {
    try {
        const { nombre } = req.body;
        
        const nuevaCiudad = await Ciudad.create({ nombre });
        res.status(201).json(nuevaCiudad);
    } catch (error) {
        console.error('Error al crear ciudad:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Actualizar ciudad
const updateCiudad = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        
        const ciudad = await Ciudad.findByPk(id);
        if (!ciudad) {
            return res.status(404).json({ error: 'Ciudad no encontrada' });
        }
        
        await ciudad.update({ nombre });
        res.json(ciudad);
    } catch (error) {
        console.error('Error al actualizar ciudad:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Eliminar ciudad
const deleteCiudad = async (req, res) => {
    try {
        const { id } = req.params;
        
        const ciudad = await Ciudad.findByPk(id);
        if (!ciudad) {
            return res.status(404).json({ error: 'Ciudad no encontrada' });
        }
        
        await ciudad.destroy();
        res.json({ message: 'Ciudad eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar ciudad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllCiudades,
    getCiudadById,
    createCiudad,
    updateCiudad,
    deleteCiudad
};