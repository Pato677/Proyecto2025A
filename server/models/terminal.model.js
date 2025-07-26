const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Terminal = sequelize.define('Terminal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING
  },
  direccion: {
    type: DataTypes.STRING
  },
  ciudad_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'terminales',
  timestamps: false
});

module.exports = Terminal;