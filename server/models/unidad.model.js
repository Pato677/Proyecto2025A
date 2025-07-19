const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Unidad = sequelize.define('Unidad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    placa: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    numeroUnidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'numero_unidad'
    },
    pisos: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    asientos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imagen: {
        type: DataTypes.TEXT
    },
    cooperativaId: {
        type: DataTypes.INTEGER, // CAMBIO: De STRING a INTEGER
        field: 'cooperativa_id'
    },
    conductorId: {
        type: DataTypes.INTEGER,
        field: 'conductor_id'
    },
    controladorId: {
        type: DataTypes.INTEGER,
        field: 'controlador_id'
    },
    estado: {
        type: DataTypes.ENUM('activa', 'mantenimiento', 'fuera_servicio'),
        defaultValue: 'activa'
    }
}, {
    tableName: 'unidades',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Unidad;