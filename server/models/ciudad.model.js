const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Ciudad = sequelize.define('Ciudad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'ciudades',
  timestamps: false
});

module.exports = Ciudad;