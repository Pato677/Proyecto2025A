// Importar la instancia de sequelize PRIMERO
const sequelize = require('../config/sequelize.config');

// Luego importar todos los modelos
const Usuario = require('./usuario.model');
const UsuarioFinal = require('./usuarioFinal.model');
const UsuarioCooperativa = require('./usuarioCooperativa.model');
const Ciudad = require('./ciudad.model');
const Terminal = require('./terminal.model');
const Conductor = require('./conductor.model');
const Unidad = require('./unidad.model');
const Ruta = require('./rutas.model');
const Viaje = require('./viaje.model');
const Boleto = require('./boleto.model');
const PasajeroBoleto = require('./PasajeroBoleto.model');

// Definir todas las relaciones

// Relaciones Usuario -> UsuarioFinal y UsuarioCooperativa
Usuario.hasOne(UsuarioFinal, { foreignKey: 'usuario_id', as: 'datosUsuarioFinal' });
UsuarioFinal.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Usuario.hasOne(UsuarioCooperativa, { foreignKey: 'usuario_id', as: 'datosCooperativa' });
UsuarioCooperativa.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Relaciones Ciudad -> Terminal
Ciudad.hasMany(Terminal, { foreignKey: 'ciudadId', as: 'terminales' });
Terminal.belongsTo(Ciudad, { foreignKey: 'ciudadId', as: 'ciudad' });

// Relaciones UsuarioCooperativa -> Conductor (actualizada)
UsuarioCooperativa.hasMany(Conductor, { foreignKey: 'cooperativa_id', as: 'conductores' });
Conductor.belongsTo(UsuarioCooperativa, { foreignKey: 'cooperativa_id', as: 'cooperativa' });

// Relaciones UsuarioCooperativa -> Unidad (actualizada)
UsuarioCooperativa.hasMany(Unidad, { foreignKey: 'cooperativa_id', as: 'unidades' });
Unidad.belongsTo(UsuarioCooperativa, { foreignKey: 'cooperativa_id', as: 'cooperativa' });

// Relaciones UsuarioCooperativa -> Ruta (actualizada)
UsuarioCooperativa.hasMany(Ruta, { foreignKey: 'cooperativa_id', as: 'rutas' });

// Relaciones Conductor -> Unidad (actualizada)
Conductor.hasMany(Unidad, { foreignKey: 'conductor_id', as: 'unidades' });
Unidad.belongsTo(Conductor, { foreignKey: 'conductor_id', as: 'conductor' });

// Relaciones Usuario -> Conductor (opcional)
Usuario.hasOne(Conductor, { foreignKey: 'usuario_id', as: 'datosConductor' });
Conductor.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Relaciones Ruta (actualizada)
Ruta.belongsTo(Terminal, { foreignKey: 'origen_id', as: 'terminalOrigen' });
Ruta.belongsTo(Terminal, { foreignKey: 'destino_id', as: 'terminalDestino' });
Ruta.belongsTo(UsuarioCooperativa, { foreignKey: 'cooperativa_id', as: 'cooperativa' });

// Relaciones Viaje (actualizada)
Ruta.hasMany(Viaje, { foreignKey: 'ruta_id', as: 'viajes' });
Viaje.belongsTo(Ruta, { foreignKey: 'ruta_id', as: 'ruta' });
Unidad.hasMany(Viaje, { foreignKey: 'unidad_id', as: 'viajes' });
Viaje.belongsTo(Unidad, { foreignKey: 'unidad_id', as: 'unidad' });
Conductor.hasMany(Viaje, { foreignKey: 'conductor_id', as: 'viajes' });
Viaje.belongsTo(Conductor, { foreignKey: 'conductor_id', as: 'conductor' });

// Relaciones Boleto (actualizada)
Usuario.hasMany(Boleto, { foreignKey: 'usuario_id', as: 'boletos' });
Boleto.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Viaje.hasMany(Boleto, { foreignKey: 'viaje_id', as: 'boletos' });
Boleto.belongsTo(Viaje, { foreignKey: 'viaje_id', as: 'viaje' });

// Relaciones PasajeroBoleto
Boleto.hasMany(PasajeroBoleto, { foreignKey: 'boleto_id', as: 'pasajeros' });
PasajeroBoleto.belongsTo(Boleto, { foreignKey: 'boleto_id', as: 'boleto' });

module.exports = {
    sequelize,
    Usuario,
    UsuarioFinal,
    UsuarioCooperativa,
    Ciudad,
    Terminal,
    Conductor,
    Unidad,
    Ruta,
    Viaje,
    Boleto,
    PasajeroBoleto
};