const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Pasajero = sequelize.define('Pasajero', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombres: {
    type: DataTypes.STRING
  },
  apellidos: {
    type: DataTypes.STRING
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY
  },
  cedula: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'pasajeros',
  timestamps: false
});

module.exports = Pasajero;