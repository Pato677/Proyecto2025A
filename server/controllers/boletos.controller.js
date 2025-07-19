const { Boleto, Usuario, Viaje, PasajeroBoleto } = require('../models');

// Obtener todos los boletos
const getAllBoletos = async (req, res) => {
    try {
        const boletos = await Boleto.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombres', 'apellidos', 'correo']
                },
                {
                    model: Viaje,
                    as: 'viaje',
                    attributes: ['id', 'fecha_viaje', 'hora_salida', 'precio']
                },
                {
                    model: PasajeroBoleto,
                    as: 'pasajeros'
                }
            ]
        });
        res.json(boletos);
    } catch (error) {
        console.error('Error al obtener boletos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener boleto por ID
const getBoletosById = async (req, res) => {
    try {
        const { id } = req.params;
        const boleto = await Boleto.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombres', 'apellidos', 'correo', 'telefono']
                },
                {
                    model: Viaje,
                    as: 'viaje',
                    include: [
                        {
                            model: Ruta,
                            as: 'ruta',
                            include: ['ciudadOrigen', 'ciudadDestino', 'terminalOrigen', 'terminalDestino']
                        },
                        {
                            model: Unidad,
                            as: 'unidad'
                        }
                    ]
                },
                {
                    model: PasajeroBoleto,
                    as: 'pasajeros'
                }
            ]
        });
        
        if (!boleto) {
            return res.status(404).json({ error: 'Boleto no encontrado' });
        }
        
        res.json(boleto);
    } catch (error) {
        console.error('Error al obtener boleto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener boletos por usuario
const getBoletosByUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const boletos = await Boleto.findAll({
            where: { usuarioId },
            include: [
                {
                    model: Viaje,
                    as: 'viaje',
                    include: [
                        {
                            model: Ruta,
                            as: 'ruta',
                            include: ['ciudadOrigen', 'ciudadDestino']
                        }
                    ]
                },
                {
                    model: PasajeroBoleto,
                    as: 'pasajeros'
                }
            ],
            order: [['fecha_boleto', 'DESC']]
        });
        
        res.json(boletos);
    } catch (error) {
        console.error('Error al obtener boletos del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear nuevo boleto
const createBoleto = async (req, res) => {
    try {
        const { 
            viajeId, 
            usuarioId, 
            numeroAsientos, 
            asientosSeleccionados, 
            precioTotal, 
            metodoPago,
            pasajeros 
        } = req.body;
        
        // Generar código único para el boleto
        const codigoBoleto = `BOL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const nuevoBoleto = await Boleto.create({
            viajeId,
            usuarioId,
            numeroAsientos,
            asientosSeleccionados,
            precioTotal,
            metodoPago,
            codigoBoleto,
            estadoPago: 'pendiente'
        });
        
        // Crear registros de pasajeros si se proporcionan
        if (pasajeros && pasajeros.length > 0) {
            const pasajerosData = pasajeros.map(pasajero => ({
                boletoId: nuevoBoleto.id,
                nombre: pasajero.nombre,
                apellido: pasajero.apellido,
                cedula: pasajero.cedula,
                numeroAsiento: pasajero.numeroAsiento
            }));
            
            await PasajeroBoleto.bulkCreate(pasajerosData);
        }
        
        res.status(201).json(nuevoBoleto);
    } catch (error) {
        console.error('Error al crear boleto:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Actualizar boleto
const updateBoleto = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            numeroAsientos, 
            asientosSeleccionados, 
            precioTotal, 
            metodoPago, 
            estadoPago 
        } = req.body;
        
        const boleto = await Boleto.findByPk(id);
        if (!boleto) {
            return res.status(404).json({ error: 'Boleto no encontrado' });
        }
        
        await boleto.update({
            numeroAsientos,
            asientosSeleccionados,
            precioTotal,
            metodoPago,
            estadoPago
        });
        
        res.json(boleto);
    } catch (error) {
        console.error('Error al actualizar boleto:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Cancelar boleto
const cancelarBoleto = async (req, res) => {
    try {
        const { id } = req.params;
        
        const boleto = await Boleto.findByPk(id);
        if (!boleto) {
            return res.status(404).json({ error: 'Boleto no encontrado' });
        }
        
        await boleto.update({ estadoPago: 'cancelado' });
        res.json({ message: 'Boleto cancelado correctamente' });
    } catch (error) {
        console.error('Error al cancelar boleto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Confirmar pago de boleto
const confirmarPago = async (req, res) => {
    try {
        const { id } = req.params;
        
        const boleto = await Boleto.findByPk(id);
        if (!boleto) {
            return res.status(404).json({ error: 'Boleto no encontrado' });
        }
        
        await boleto.update({ estadoPago: 'pagado' });
        res.json({ message: 'Pago confirmado correctamente', boleto });
    } catch (error) {
        console.error('Error al confirmar pago:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllBoletos,
    getBoletosById,
    getBoletosByUsuario,
    createBoleto,
    updateBoleto,
    cancelarBoleto,
    confirmarPago
};