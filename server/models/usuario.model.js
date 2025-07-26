const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contrasena: {
    type: DataTypes.STRING
  },
  telefono: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

module.exports = Usuario;