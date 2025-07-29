const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const UsuarioCooperativa = sequelize.define('UsuarioCooperativa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  razon_social: {
    type: DataTypes.STRING
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
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'usuarios_cooperativas',
  timestamps: false
});

module.exports = UsuarioCooperativa;