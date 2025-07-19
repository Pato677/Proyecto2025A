const { Viaje, Ruta, Unidad, Ciudad, Terminal } =  require('../models');

// Obtener todos los viajes
const getAllViajes = async (req, res) => {
    try {
        const viajes = await Viaje.findAll({
            include: [
                {
                    model: Ruta,
                    as: 'ruta',
                    include: [
                        {
                            model: Ciudad,
                            as: 'ciudadOrigen',
                            attributes: ['id', 'nombre']
                        },
                        {
                            model: Ciudad,
                            as: 'ciudadDestino',
                            attributes: ['id', 'nombre']
                        },
                        {
                            model: Terminal,
                            as: 'terminalOrigen',
                            attributes: ['id', 'nombre']
                        },
                        {
                            model: Terminal,
                            as: 'terminalDestino',
                            attributes: ['id', 'nombre']
                        }
                    ]
                },
                {
                    model: Unidad,
                    as: 'unidad',
                    attributes: ['id', 'placa', 'numeroUnidad', 'asientos']
                }
            ]
        });
        res.json(viajes);
    } catch (error) {
        console.error('Error al obtener viajes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener viaje por ID
const getViajeById = async (req, res) => {
    try {
        const { id } = req.params;
        const viaje = await Viaje.findByPk(id, {
            include: [
                {
                    model: Ruta,
                    as: 'ruta',
                    include: [
                        {
                            model: Ciudad,
                            as: 'ciudadOrigen',
                            attributes: ['id', 'nombre']
                        },
                        {
                            model: Ciudad,
                            as: 'ciudadDestino',
                            attributes: ['id', 'nombre']
                        },
                        {
                            model: Terminal,
                            as: 'terminalOrigen',
                            attributes: ['id', 'nombre']
                        },
                        {
                            model: Terminal,
                            as: 'terminalDestino',
                            attributes: ['id', 'nombre']
                        }
                    ]
                },
                {
                    model: Unidad,
                    as: 'unidad',
                    attributes: ['id', 'placa', 'numeroUnidad', 'asientos']
                }
            ]
        });
        
        if (!viaje) {
            return res.status(404).json({ error: 'Viaje no encontrado' });
        }
        
        res.json(viaje);
    } catch (error) {
        console.error('Error al obtener viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Buscar viajes disponibles
const buscarViajes = async (req, res) => {
    try {
        const { origenCiudad, destinoCiudad, fecha } = req.query;
        
        const viajes = await Viaje.findAll({
            where: {
                fechaViaje: fecha,
                estado: 'programado'
            },
            include: [
                {
                    model: Ruta,
                    as: 'ruta',
                    include: [
                        {
                            model: Ciudad,
                            as: 'ciudadOrigen',
                            where: origenCiudad ? { nombre: origenCiudad } : {},
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
                            as: 'terminalOrigen',
                            attributes: ['id', 'nombre']
                        },
                        {
                            model: Terminal,
                            as: 'terminalDestino',
                            attributes: ['id', 'nombre']
                        }
                    ]
                },
                {
                    model: Unidad,
                    as: 'unidad',
                    attributes: ['id', 'placa', 'numeroUnidad', 'asientos']
                }
            ]
        });
        
        res.json(viajes);
    } catch (error) {
        console.error('Error al buscar viajes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear nuevo viaje
const createViaje = async (req, res) => {
    try {
        const { 
            rutaId, 
            unidadId, 
            fechaViaje, 
            horaSalida, 
            horaLlegada, 
            precio, 
            asientosDisponibles, 
            empresa 
        } = req.body;
        
        const nuevoViaje = await Viaje.create({
            rutaId,
            unidadId,
            fechaViaje,
            horaSalida,
            horaLlegada,
            precio,
            asientosDisponibles,
            empresa
        });
        
        res.status(201).json(nuevoViaje);
    } catch (error) {
        console.error('Error al crear viaje:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Actualizar viaje
const updateViaje = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            rutaId, 
            unidadId, 
            fechaViaje, 
            horaSalida, 
            horaLlegada, 
            precio, 
            asientosDisponibles, 
            empresa, 
            estado 
        } = req.body;
        
        const viaje = await Viaje.findByPk(id);
        if (!viaje) {
            return res.status(404).json({ error: 'Viaje no encontrado' });
        }
        
        await viaje.update({
            rutaId,
            unidadId,
            fechaViaje,
            horaSalida,
            horaLlegada,
            precio,
            asientosDisponibles,
            empresa,
            estado
        });
        
        res.json(viaje);
    } catch (error) {
        console.error('Error al actualizar viaje:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Eliminar viaje
const deleteViaje = async (req, res) => {
    try {
        const { id } = req.params;
        
        const viaje = await Viaje.findByPk(id);
        if (!viaje) {
            return res.status(404).json({ error: 'Viaje no encontrado' });
        }
        
        await viaje.destroy();
        res.json({ message: 'Viaje eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllViajes,
    getViajeById,
    buscarViajes,
    createViaje,
    updateViaje,
    deleteViaje
};