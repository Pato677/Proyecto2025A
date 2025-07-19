const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Viaje = sequelize.define('Viaje', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rutaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ruta_id'
    },
    unidadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'unidad_id'
    },
    fechaViaje: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'fecha_viaje'
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
    precio: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
    },
    asientosDisponibles: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'asientos_disponibles'
    },
    empresa: {
        type: DataTypes.STRING(100)
    },
    estado: {
        type: DataTypes.ENUM('programado', 'en_curso', 'completado', 'cancelado'),
        defaultValue: 'programado'
    }
}, {
    tableName: 'viajes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Viaje;