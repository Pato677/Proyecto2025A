const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Compra = sequelize.define('Compra', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE
  },
  email_contacto: {
    type: DataTypes.STRING
  },
  telefono_contacto: {
    type: DataTypes.STRING
  },
  pasajero_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  viaje_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'compras',
  timestamps: false
});

module.exports = Compra;