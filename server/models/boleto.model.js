const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Boleto = sequelize.define('Boleto', {
  codigo: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL
  },
  compra_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pasajero_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  asiento_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'boletos',
  timestamps: false
});

module.exports = Boleto;
