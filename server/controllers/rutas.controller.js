const { Ruta, Ciudad, Terminal, Cooperativa } = require('../models');

// Obtener todas las rutas
const getAllRutas = async (req, res) => {
    try {
        const rutas = await Ruta.findAll({
            include: [
                {
                    model: Ciudad,
                    as: 'ciudadOrigen',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Terminal,
                    as: 'terminalOrigen',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Ciudad,
                    as: 'ciudadDestino',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Terminal,
                    as: 'terminalDestino',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Cooperativa,
                    as: 'cooperativa',
                    attributes: ['id', 'razonSocial']
                }
            ]
        });
        res.json(rutas);
    } catch (error) {
        console.error('Error al obtener rutas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener ruta por ID
const getRutaById = async (req, res) => {
    try {
        const { id } = req.params;
        const ruta = await Ruta.findByPk(id, {
            include: [
                {
                    model: Ciudad,
                    as: 'ciudadOrigen',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Terminal,
                    as: 'terminalOrigen',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Ciudad,
                    as: 'ciudadDestino',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Terminal,
                    as: 'terminalDestino',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Cooperativa,
                    as: 'cooperativa',
                    attributes: ['id', 'razonSocial']
                }
            ]
        });
        
        if (!ruta) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }
        
        res.json(ruta);
    } catch (error) {
        console.error('Error al obtener ruta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Buscar rutas por origen y destino
const buscarRutas = async (req, res) => {
    try {
        const { origenCiudad, destinoCiudad } = req.query;
        
        const rutas = await Ruta.findAll({
            include: [
                {
                    model: Ciudad,
                    as: 'ciudadOrigen',
                    where: origenCiudad ? { nombre: origenCiudad } : {},
                    attributes: ['id', 'nombre']
                },
                {
                    model: Terminal,
                    as: 'terminalOrigen',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Ciudad,
                    as: 'ciudadDestino',
                    where: destinoCiudad ? { nombre: destinoCiudad } : {},
                    attributes: ['id', 'nombre']
                },
                {
                    model: Terminal,
                    as: 'terminalDestino',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Cooperativa,
                    as: 'cooperativa',
                    attributes: ['id', 'razonSocial']
                }
            ],
            where: { estado: 'activa' }
        });
        
        res.json(rutas);
    } catch (error) {
        console.error('Error al buscar rutas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear nueva ruta
const createRuta = async (req, res) => {
    try {
        const { 
            numeroRuta, 
            ciudadOrigenId, 
            terminalOrigenId, 
            ciudadDestinoId, 
            terminalDestinoId, 
            horaSalida, 
            horaLlegada, 
            paradas, 
            distanciaKm, 
            cooperativaId 
        } = req.body;
        
        const nuevaRuta = await Ruta.create({
            numeroRuta,
            ciudadOrigenId,
            terminalOrigenId,
            ciudadDestinoId,
            terminalDestinoId,
            horaSalida,
            horaLlegada,
            paradas,
            distanciaKm,
            cooperativaId
        });
        
        res.status(201).json(nuevaRuta);
    } catch (error) {
        console.error('Error al crear ruta:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Actualizar ruta
const updateRuta = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            numeroRuta, 
            ciudadOrigenId, 
            terminalOrigenId, 
            ciudadDestinoId, 
            terminalDestinoId, 
            horaSalida, 
            horaLlegada, 
            paradas, 
            distanciaKm, 
            cooperativaId, 
            estado 
        } = req.body;
        
        const ruta = await Ruta.findByPk(id);
        if (!ruta) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }
        
        await ruta.update({
            numeroRuta,
            ciudadOrigenId,
            terminalOrigenId,
            ciudadDestinoId,
            terminalDestinoId,
            horaSalida,
            horaLlegada,
            paradas,
            distanciaKm,
            cooperativaId,
            estado
        });
        
        res.json(ruta);
    } catch (error) {
        console.error('Error al actualizar ruta:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Eliminar ruta
const deleteRuta = async (req, res) => {
    try {
        const { id } = req.params;
        
        const ruta = await Ruta.findByPk(id);
        if (!ruta) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }
        
        await ruta.destroy();
        res.json({ message: 'Ruta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar ruta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllRutas,
    getRutaById,
    buscarRutas,
    createRuta,
    updateRuta,
    deleteRuta
};