const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Viaje = sequelize.define('Viaje', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_salida: {
    type: DataTypes.DATE
  },
  fecha_llegada: {
    type: DataTypes.DATE
  },
  numero_asientos_ocupados: {
    type: DataTypes.INTEGER
  },
  precio: {
    type: DataTypes.DECIMAL
  },
  ruta_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unidad_id: {
    type: DataTypes.INTEGER,
    allowNull: true  // Permitir null para que se pueda asignar después
  }
}, {
  tableName: 'viajes',
  timestamps: false
});

module.exports = Viaje;