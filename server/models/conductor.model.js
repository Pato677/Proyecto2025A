const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Conductor = sequelize.define('Conductor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    identificacion: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    tipoLicencia: {
        type: DataTypes.ENUM('D1(Turismo)', 'D (Pasajeros)', 'N/A'),
        allowNull: false,
        field: 'tipo_licencia'
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    roles: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: ['conductor']
    },
    cooperativaId: {
        type: DataTypes.STRING(10),
        field: 'cooperativa_id'
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo'
    }
}, {
    tableName: 'conductores',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Conductor;