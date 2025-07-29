const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const UsuarioFinal = sequelize.define('UsuarioFinal', {
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
  },
  genero: {
    type: DataTypes.STRING
  },
  direccion: {
    type: DataTypes.STRING
  },
  ciudad: {
    type: DataTypes.STRING
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'usuarios_finales',
  timestamps: false
});

module.exports = UsuarioFinal;