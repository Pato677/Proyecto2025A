const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const PasajeroBoleto = sequelize.define('PasajeroBoleto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    boletoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'boleto_id'
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cedula: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    numeroAsiento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'numero_asiento'
    }
}, {
    tableName: 'pasajeros_boleto',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = PasajeroBoleto;