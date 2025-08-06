const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Asiento = sequelize.define('Asiento', {
  numeracion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  }
}, {
  tableName: 'asientos',
  timestamps: false
});

module.exports = Asiento;