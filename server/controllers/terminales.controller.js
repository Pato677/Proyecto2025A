const { Terminal, Ciudad } =  require('../models');

// Obtener todos los terminales
const getAllTerminales = async (req, res) => {
    try {
        const terminales = await Terminal.findAll({
            include: [
                {
                    model: Ciudad,
                    as: 'ciudad',
                    attributes: ['id', 'nombre']
                }
            ]
        });
        res.json(terminales);
    } catch (error) {
        console.error('Error al obtener terminales:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener terminal por ID
const getTerminalById = async (req, res) => {
    try {
        const { id } = req.params;
        const terminal = await Terminal.findByPk(id, {
            include: [
                {
                    model: Ciudad,
                    as: 'ciudad',
                    attributes: ['id', 'nombre']
                }
            ]
        });
        
        if (!terminal) {
            return res.status(404).json({ error: 'Terminal no encontrado' });
        }
        
        res.json(terminal);
    } catch (error) {
        console.error('Error al obtener terminal:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener terminales por ciudad
const getTerminalesByCiudad = async (req, res) => {
    try {
        const { ciudadId } = req.params;
        const terminales = await Terminal.findAll({
            where: { ciudadId },
            include: [
                {
                    model: Ciudad,
                    as: 'ciudad',
                    attributes: ['id', 'nombre']
                }
            ]
        });
        res.json(terminales);
    } catch (error) {
        console.error('Error al obtener terminales por ciudad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear nuevo terminal
const createTerminal = async (req, res) => {
    try {
        const { nombre, ciudadId, direccion } = req.body;
        
        const nuevoTerminal = await Terminal.create({
            nombre,
            ciudad_id: ciudadId, // Mapear ciudadId a ciudad_id
            direccion
        });
        
        res.status(201).json(nuevoTerminal);
    } catch (error) {
        console.error('Error al crear terminal:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Actualizar terminal
const updateTerminal = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, ciudadId, direccion } = req.body;
        
        const terminal = await Terminal.findByPk(id);
        if (!terminal) {
            return res.status(404).json({ error: 'Terminal no encontrado' });
        }
        
        await terminal.update({
            nombre,
            ciudad_id: ciudadId, // Mapear ciudadId a ciudad_id
            direccion
        });
        
        res.json(terminal);
    } catch (error) {
        console.error('Error al actualizar terminal:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Eliminar terminal
const deleteTerminal = async (req, res) => {
    try {
        const { id } = req.params;
        
        const terminal = await Terminal.findByPk(id);
        if (!terminal) {
            return res.status(404).json({ error: 'Terminal no encontrado' });
        }
        
        await terminal.destroy();
        res.json({ message: 'Terminal eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar terminal:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllTerminales,
    getTerminalById,
    getTerminalesByCiudad,
    createTerminal,
    updateTerminal,
    deleteTerminal
};