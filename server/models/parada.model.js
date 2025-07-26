const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Parada = sequelize.define('Parada', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ruta_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  terminal_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'paradas',
  timestamps: false
});

module.exports = Parada;