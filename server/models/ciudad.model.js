const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Ciudad = sequelize.define('Ciudad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'ciudades',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Ciudad;