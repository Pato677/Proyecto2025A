// models/usuarioFinal.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const UsuarioFinal = sequelize.define('UsuarioFinal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellidos: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cedula: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  genero: {
    type: DataTypes.ENUM('masculino', 'femenino', 'otro'),
    allowNull: true
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ciudad: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  foto_perfil: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  preferencias_notificacion: {
    type: DataTypes.JSON,
    allowNull: true
  },
  puntos_fidelidad: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'usuarios_finales',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['cedula']
    },
    {
      fields: ['nombres', 'apellidos']
    }
  ]
});

module.exports = UsuarioFinal;
