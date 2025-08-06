const { Boleto, Pasajero, Compra, Viaje } = require('../models');

// Obtener todos los boletos
const getAllBoletos = async (req, res) => {
    try {
        const boletos = await Boleto.findAll({
            include: [
                Pasajero,
                {
                    model: Compra,
                    include: [Viaje]
                }
            ]
        });
        res.json(boletos);
    } catch (error) {
        console.error('Error al obtener boletos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener boleto por código
const getBoletosById = async (req, res) => {
    try {
        const { id } = req.params;
        const boleto = await Boleto.findOne({
            where: { codigo: id },
            include: [
                Pasajero,
                {
                    model: Compra,
                    include: [Viaje]
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

// Obtener boletos por pasajero
const getBoletosByPasajero = async (req, res) => {
    try {
        const { pasajeroId } = req.params;
        const boletos = await Boleto.findAll({
            where: { pasajero_id: pasajeroId },
            include: [
                Pasajero,
                {
                    model: Compra,
                    include: [Viaje]
                }
            ]
        });
        res.json(boletos);
    } catch (error) {
        console.error('Error al obtener boletos del pasajero:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear nuevo boleto
const createBoleto = async (req, res) => {
    try {
        const { valor, compra_id, pasajero_id, viaje_id } = req.body;
        // Generar código único para el boleto
        const codigo = `BOL-${Date.now()}-${Math.floor(Math.random()*1000).toString().padStart(3, '0')}`;

        const nuevoBoleto = await Boleto.create({
            codigo,
            valor,
            compra_id,
            pasajero_id,
            viaje_id
        });

        const boletoCompleto = await Boleto.findByPk(nuevoBoleto.codigo, {
            include: [
                Pasajero,
                {
                    model: Compra,
                    include: [Viaje]
                }
            ]
        });

        res.status(201).json(boletoCompleto);
    } catch (error) {
        console.error('Error al crear boleto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar boleto
const updateBoleto = async (req, res) => {
    try {
        const { id } = req.params;
        const { valor } = req.body;

        const boleto = await Boleto.findByPk(id);
        if (!boleto) {
            return res.status(404).json({ error: 'Boleto no encontrado' });
        }

        await boleto.update({ valor });

        const boletoCompleto = await Boleto.findByPk(id, {
            include: [
                Pasajero,
                {
                    model: Compra,
                    include: [Viaje]
                }
            ]
        });

        res.json(boletoCompleto);
    } catch (error) {
        console.error('Error al actualizar boleto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar boleto
const deleteBoleto = async (req, res) => {
    try {
        const { id } = req.params;
        const boleto = await Boleto.findByPk(id);
        if (!boleto) {
            return res.status(404).json({ error: 'Boleto no encontrado' });
        }
        await boleto.destroy();
        res.json({ message: 'Boleto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar boleto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllBoletos,
    getBoletosById,
    getBoletosByPasajero,
    createBoleto,
    updateBoleto,
    deleteBoleto
};