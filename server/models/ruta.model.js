const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Ruta = sequelize.define('Ruta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_ruta: {
    type: DataTypes.STRING
  },
  hora_salida: {
    type: DataTypes.TIME
  },
  hora_llegada: {
    type: DataTypes.TIME
  },
  cooperativa_id: {
    type: DataTypes.INTEGER
  },
  terminal_destino_id: {
    type: DataTypes.INTEGER
  },
  terminal_origen_id: {
    type: DataTypes.INTEGER
  },
  conductor_id: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'rutas',
  timestamps: false
});

module.exports = Ruta;