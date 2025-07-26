const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Conductor = sequelize.define('Conductor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING
  },
  identificacion: {
    type: DataTypes.STRING
  },
  tipo_licencia: {
    type: DataTypes.STRING
  },
  telefono: {
    type: DataTypes.STRING
  },
  correo: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'conductores',
  timestamps: false
});

module.exports = Conductor;