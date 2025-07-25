// models/usuarioCooperativa.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const UsuarioCooperativa = sequelize.define('UsuarioCooperativa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre_cooperativa: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  ruc: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  razon_social: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  representante_legal: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  cedula_representante: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  direccion_matriz: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ciudad_matriz: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  telefono_fijo: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  pagina_web: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  logo_cooperativa: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fecha_constitucion: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  numero_socios: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  estado_juridico: {
    type: DataTypes.ENUM('activa', 'inactiva', 'en_tramite'),
    defaultValue: 'en_tramite'
  },
  documentos_legales: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'usuarios_cooperativas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['ruc']
    },
    {
      fields: ['nombre_cooperativa']
    },
    {
      fields: ['estado_juridico']
    }
  ]
});

module.exports = UsuarioCooperativa;
