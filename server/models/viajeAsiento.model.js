const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const ViajeAsiento = sequelize.define('ViajeAsiento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  asiento_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  viaje_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'viaje_asientos',
  timestamps: false
});

module.exports = ViajeAsiento;