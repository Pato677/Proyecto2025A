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
    type: DataTypes.INTEGER
  },
  conductor_id: {
    type: DataTypes.INTEGER
  },
  controlador_id: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'unidades',
  timestamps: false
});

module.exports = Unidad;