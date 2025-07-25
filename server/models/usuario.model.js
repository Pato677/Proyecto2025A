const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('usuario', 'cooperativa', 'superusuario'),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'suspendido'),
    defaultValue: 'activo'
  },
  email_verificado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fecha_ultimo_acceso: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['rol']
    },
    {
      fields: ['estado']
    },
    {
      fields: ['rol', 'estado']
    }
  ]
});

module.exports = Usuario;