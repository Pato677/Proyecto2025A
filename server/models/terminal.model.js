const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Terminal = sequelize.define('Terminal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    ciudadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ciudad_id'
    },
    direccion: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'terminales',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Terminal;