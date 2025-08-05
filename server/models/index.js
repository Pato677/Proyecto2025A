const Usuario = require('./usuario.model');
const UsuarioFinal = require('./usuarioFinal.model');
const UsuarioCooperativa = require('./usuarioCooperativa.model');
const Ciudad = require('./ciudad.model');
const Terminal = require('./terminal.model');
const Conductor = require('./conductor.model');
const Unidad = require('./unidad.model');
const Ruta = require('./ruta.model');
const Viaje = require('./viaje.model');
const Boleto = require('./boleto.model');
const Pasajero = require('./pasajero.model');
const Compra = require('./compra.model');
const Asiento = require('./asiento.model');
const ViajeAsiento = require('./viajeAsiento.model');
const Parada = require('./parada.model');

// UsuarioFinal - Usuario (FK: usuario_id)
Usuario.hasOne(UsuarioFinal, { foreignKey: 'usuario_id' });
UsuarioFinal.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// UsuarioCooperativa - Usuario (FK: usuario_id)
Usuario.hasOne(UsuarioCooperativa, { foreignKey: 'usuario_id' });
UsuarioCooperativa.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// UsuarioCooperativa - Unidad (FK: cooperativa_id)
UsuarioCooperativa.hasMany(Unidad, { foreignKey: 'cooperativa_id' });
Unidad.belongsTo(UsuarioCooperativa, { foreignKey: 'cooperativa_id' });

// Unidad - Conductor (FK: conductor_id)
Conductor.hasMany(Unidad, { foreignKey: 'conductor_id', as: 'ConductorUnidades' });
Unidad.belongsTo(Conductor, { foreignKey: 'conductor_id', as: 'Conductor' });

// Unidad - Controlador (FK: controlador_id)
Conductor.hasMany(Unidad, { foreignKey: 'controlador_id', as: 'ControladorUnidades' });
Unidad.belongsTo(Conductor, { foreignKey: 'controlador_id', as: 'Controlador' });

// Unidad - Viaje (FK: unidad_id)
Unidad.hasMany(Viaje, { foreignKey: 'unidad_id' });
Viaje.belongsTo(Unidad, { foreignKey: 'unidad_id', as: 'unidad' });
// Ruta - UsuarioCooperativa (FK: cooperativa_id)
UsuarioCooperativa.hasMany(Ruta, { foreignKey: 'cooperativa_id' });
Ruta.belongsTo(UsuarioCooperativa, { foreignKey: 'cooperativa_id' });

// Ruta - Viaje (FK: ruta_id)
Ruta.hasMany(Viaje, { foreignKey: 'ruta_id' });
Viaje.belongsTo(Ruta, { foreignKey: 'ruta_id', as: 'ruta'});

// Compra - Viaje (FK: viaje_id)
Viaje.hasMany(Compra, { foreignKey: 'viaje_id' });
Compra.belongsTo(Viaje, { foreignKey: 'viaje_id' });

// Compra - Boleto (FK: compra_id)
Compra.hasMany(Boleto, { foreignKey: 'compra_id' });
Boleto.belongsTo(Compra, { foreignKey: 'compra_id' });

// Boleto - Pasajero (FK: pasajero_id)
Pasajero.hasOne(Boleto, { foreignKey: 'pasajero_id' });
Boleto.belongsTo(Pasajero, { foreignKey: 'pasajero_id' });

// Compra - Pasajero (FK: pasajero_id)
Pasajero.hasMany(Compra, { foreignKey: 'pasajero_id' });
Compra.belongsTo(Pasajero, { foreignKey: 'pasajero_id' });

// ViajeAsiento - Viaje (FK: viaje_id)
Viaje.hasMany(ViajeAsiento, { foreignKey: 'viaje_id' });
ViajeAsiento.belongsTo(Viaje, { foreignKey: 'viaje_id' });

// ViajeAsiento - Asiento (FK: asiento_id)
Asiento.hasMany(ViajeAsiento, { foreignKey: 'asiento_id' });
ViajeAsiento.belongsTo(Asiento, { foreignKey: 'asiento_id' });

// Boleto - Asiento (FK: asiento_id)
Asiento.hasMany(Boleto, { foreignKey: 'asiento_id' });
Boleto.belongsTo(Asiento, { foreignKey: 'asiento_id' });

// Parada (tabla intermedia) - Ruta y Terminal (muchos a muchos)
Ruta.belongsToMany(Terminal, { through: Parada, foreignKey: 'ruta_id', otherKey: 'terminal_id' });
Terminal.belongsToMany(Ruta, { through: Parada, foreignKey: 'terminal_id', otherKey: 'ruta_id' });

// Terminal - Ciudad (FK: ciudad_id)
Ciudad.hasMany(Terminal, { foreignKey: 'ciudad_id', as: 'terminales' });
Terminal.belongsTo(Ciudad, { foreignKey: 'ciudad_id', as: 'ciudad' });

// Ruta - Terminal Origen (FK: terminal_origen_id)
Terminal.hasMany(Ruta, { foreignKey: 'terminal_origen_id', as: 'rutasOrigen' });
Ruta.belongsTo(Terminal, { foreignKey: 'terminal_origen_id', as: 'terminalOrigen' });

// Ruta - Terminal Destino (FK: terminal_destino_id)
Terminal.hasMany(Ruta, { foreignKey: 'terminal_destino_id', as: 'rutasDestino' });
Ruta.belongsTo(Terminal, { foreignKey: 'terminal_destino_id', as: 'terminalDestino' });

module.exports = {
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
  Pasajero,
  Compra,
  Asiento,
  ViajeAsiento,
  Parada
};