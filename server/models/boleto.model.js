const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Boleto = sequelize.define('Boleto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    viaje_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numero_asiento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('reservado', 'pagado', 'usado', 'cancelado'),
        defaultValue: 'reservado'
    },
    codigo_qr: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: true
    },
    fecha_compra: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_uso: {
        type: DataTypes.DATE,
        allowNull: true
    },
    metodo_pago: {
        type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'paypal'),
        defaultValue: 'efectivo'
    }
}, {
    tableName: 'boletos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Boleto;