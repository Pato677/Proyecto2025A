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

// UsuarioFinal - Usuario (FK: usuario_id)
Usuario.hasOne(UsuarioFinal, { foreignKey: 'usuario_id' });
UsuarioFinal.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// UsuarioCooperativa - Usuario (FK: usuario_id)
Usuario.hasOne(UsuarioCooperativa, { foreignKey: 'usuario_id' });
UsuarioCooperativa.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Terminal - Ciudad (FK: ciudad_id)
Ciudad.hasMany(Terminal, { foreignKey: 'ciudad_id' });
Terminal.belongsTo(Ciudad, { foreignKey: 'ciudad_id' });

// Unidad - UsuarioCooperativa (FK: cooperativa_id)
UsuarioCooperativa.hasMany(Unidad, { foreignKey: 'cooperativa_id' });
Unidad.belongsTo(UsuarioCooperativa, { foreignKey: 'cooperativa_id' });

// Unidad - Conductor (FK: conductor_id)
Conductor.hasMany(Unidad, { foreignKey: 'conductor_id' });
Unidad.belongsTo(Conductor, { foreignKey: 'conductor_id' });

// Unidad - Conductor (FK: controlador_id) // Relación para controlador
Conductor.hasMany(Unidad, { foreignKey: 'controlador_id', as: 'ControladorUnidades' });
Unidad.belongsTo(Conductor, { foreignKey: 'controlador_id', as: 'Controlador' });

// Ruta - UsuarioCooperativa (FK: cooperativa_id)
UsuarioCooperativa.hasMany(Ruta, { foreignKey: 'cooperativa_id' });
Ruta.belongsTo(UsuarioCooperativa, { foreignKey: 'cooperativa_id' });

// Ruta - Terminal (FK: terminal_destino_id)
Terminal.hasMany(Ruta, { foreignKey: 'terminal_destino_id', as: 'DestinoRutas' });
Ruta.belongsTo(Terminal, { foreignKey: 'terminal_destino_id', as: 'DestinoTerminal' });

// Ruta - Terminal (FK: terminal_origen_id)
Terminal.hasMany(Ruta, { foreignKey: 'terminal_origen_id', as: 'OrigenRutas' });
Ruta.belongsTo(Terminal, { foreignKey: 'terminal_origen_id', as: 'OrigenTerminal' });

// Ruta - Conductor (FK: conductor_id)
Conductor.hasMany(Ruta, { foreignKey: 'conductor_id' });
Ruta.belongsTo(Conductor, { foreignKey: 'conductor_id' });

// Viaje - Ruta (FK: ruta_id)
Ruta.hasMany(Viaje, { foreignKey: 'ruta_id' });
Viaje.belongsTo(Ruta, { foreignKey: 'ruta_id' });

// Viaje - Unidad (FK: unidad_id)
Unidad.hasMany(Viaje, { foreignKey: 'unidad_id' });
Viaje.belongsTo(Unidad, { foreignKey: 'unidad_id' });

// Compra - Pasajero (FK: pasajero_id)
Pasajero.hasMany(Compra, { foreignKey: 'pasajero_id' });
Compra.belongsTo(Pasajero, { foreignKey: 'pasajero_id' });

// Compra - Viaje (FK: viaje_id)
Viaje.hasMany(Compra, { foreignKey: 'viaje_id' });
Compra.belongsTo(Viaje, { foreignKey: 'viaje_id' });

// Boleto - Compra (FK: compra_id)
Compra.hasMany(Boleto, { foreignKey: 'compra_id' });
Boleto.belongsTo(Compra, { foreignKey: 'compra_id' });

// Boleto - Pasajero (FK: pasajero_id)
Pasajero.hasMany(Boleto, { foreignKey: 'pasajero_id' });
Boleto.belongsTo(Pasajero, { foreignKey: 'pasajero_id' });

// ViajeAsiento - Viaje (FK: viaje_id)
Viaje.hasMany(ViajeAsiento, { foreignKey: 'viaje_id' });
ViajeAsiento.belongsTo(Viaje, { foreignKey: 'viaje_id' });

// ViajeAsiento - Asiento (FK: asiento_id)
Asiento.hasMany(ViajeAsiento, { foreignKey: 'asiento_id' });
ViajeAsiento.belongsTo(Asiento, { foreignKey: 'asiento_id' });

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
  ViajeAsiento
};