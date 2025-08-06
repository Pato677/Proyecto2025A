const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const UsuarioCooperativa = sequelize.define('UsuarioCooperativa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  razon_social: {
    type: DataTypes.STRING,
    allowNull: false
  },
  permiso_operacion: {
    type: DataTypes.STRING
  },
  ruc: {
    type: DataTypes.STRING
  },
  estado: {
  type: DataTypes.STRING,
  defaultValue: 'desactivo'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cooperativas', // Cambiar a la tabla correcta
  timestamps: true // Habilitar timestamps para createdAt y updatedAt
});

module.exports = UsuarioCooperativa;