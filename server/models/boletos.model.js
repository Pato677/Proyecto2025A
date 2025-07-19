const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Boleto = sequelize.define('Boleto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    viajeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'viaje_id'
    },
    usuarioId: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'usuario_id'
    },
    numeroAsientos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'numero_asientos'
    },
    asientosSeleccionados: {
        type: DataTypes.JSON,
        allowNull: false,
        field: 'asientos_seleccionados'
    },
    precioTotal: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        field: 'precio_total'
    },
    estadoPago: {
        type: DataTypes.ENUM('pendiente', 'pagado', 'cancelado'),
        defaultValue: 'pendiente',
        field: 'estado_pago'
    },
    metodoPago: {
        type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia'),
        defaultValue: 'efectivo',
        field: 'metodo_pago'
    },
    codigoBoleto: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: 'codigo_boleto'
    },
    fechaBoleto: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'fecha_boleto'
    }
}, {
    tableName: 'boletos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Boleto;