const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Cooperativa = sequelize.define('Cooperativa', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true 
    },
    razonSocial: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'razon_social'
    },
    permisoOperacion: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'permiso_operacion'
    },
    ruc: {
        type: DataTypes.STRING(13),
        allowNull: false,
        unique: true
    },
    correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('activa', 'pendiente', 'suspendida'),
        defaultValue: 'pendiente'
    }
}, {
    tableName: 'cooperativas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Cooperativa;