const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Ruta = sequelize.define('Ruta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numeroRuta: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: 'numero_ruta'
    },
    ciudadOrigenId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ciudad_origen_id'
    },
    terminalOrigenId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'terminal_origen_id'
    },
    ciudadDestinoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ciudad_destino_id'
    },
    terminalDestinoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'terminal_destino_id'
    },
    horaSalida: {
        type: DataTypes.TIME,
        allowNull: false,
        field: 'hora_salida'
    },
    horaLlegada: {
        type: DataTypes.TIME,
        allowNull: false,
        field: 'hora_llegada'
    },
    paradas: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    distanciaKm: {
        type: DataTypes.DECIMAL(8, 2),
        field: 'distancia_km'
    },
    cooperativaId: {
        type: DataTypes.STRING(10),
        field: 'cooperativa_id'
    },
    estado: {
        type: DataTypes.ENUM('activa', 'suspendida'),
        defaultValue: 'activa'
    }
}, {
    tableName: 'rutas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Ruta;