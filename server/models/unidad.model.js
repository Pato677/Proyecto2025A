const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Unidad = sequelize.define('Unidad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  placa: {
    type: DataTypes.STRING
  },
  numero_unidad: {
    type: DataTypes.INTEGER
  },
  imagen_path: {
    type: DataTypes.STRING
  },
  cooperativa_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  conductor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  controlador_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'unidades',
  timestamps: false
});

module.exports = Unidad;