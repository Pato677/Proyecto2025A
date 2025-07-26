const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const ViajeAsiento = sequelize.define('ViajeAsiento', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  asiento_id: {
    type: DataTypes.STRING
  },
  viaje_id: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'viaje_asientos',
  timestamps: false
});

module.exports = ViajeAsiento;