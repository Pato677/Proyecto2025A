const Usuario = require('./usuario.model');
const Cooperativa = require('./cooperativa.model');
const Ciudad = require('./ciudad.model');
const Terminal = require('./terminal.model');
const Conductor = require('./conductor.model');
const Unidad = require('./unidad.model');
const Ruta = require('./rutas.model');
const Viaje = require('./viaje.model');
const Boleto = require('./boleto.model');
const PasajeroBoleto = require('./PasajeroBoleto.model');

// Relaciones Ciudad -> Terminal
Ciudad.hasMany(Terminal, { foreignKey: 'ciudadId', as: 'terminales' });
Terminal.belongsTo(Ciudad, { foreignKey: 'ciudadId', as: 'ciudad' });

// Relaciones Cooperativa -> Conductor
Cooperativa.hasMany(Conductor, { foreignKey: 'cooperativaId', as: 'conductores' });
Conductor.belongsTo(Cooperativa, { foreignKey: 'cooperativaId', as: 'cooperativa' });

// Relaciones Cooperativa -> Unidad
Cooperativa.hasMany(Unidad, { foreignKey: 'cooperativaId', as: 'unidades' });
Unidad.belongsTo(Cooperativa, { foreignKey: 'cooperativaId', as: 'cooperativa' });

// Relaciones Conductor -> Unidad
Conductor.hasMany(Unidad, { foreignKey: 'conductorId', as: 'unidadesComoConductor' });
Conductor.hasMany(Unidad, { foreignKey: 'controladorId', as: 'unidadesComoControlador' });
Unidad.belongsTo(Conductor, { foreignKey: 'conductorId', as: 'conductor' });
Unidad.belongsTo(Conductor, { foreignKey: 'controladorId', as: 'controlador' });

// Relaciones Ruta
Ruta.belongsTo(Ciudad, { foreignKey: 'ciudadOrigenId', as: 'ciudadOrigen' });
Ruta.belongsTo(Terminal, { foreignKey: 'terminalOrigenId', as: 'terminalOrigen' });
Ruta.belongsTo(Ciudad, { foreignKey: 'ciudadDestinoId', as: 'ciudadDestino' });
Ruta.belongsTo(Terminal, { foreignKey: 'terminalDestinoId', as: 'terminalDestino' });
Ruta.belongsTo(Cooperativa, { foreignKey: 'cooperativaId', as: 'cooperativa' });

// Relaciones Viaje
Ruta.hasMany(Viaje, { foreignKey: 'rutaId', as: 'viajes' });
Viaje.belongsTo(Ruta, { foreignKey: 'rutaId', as: 'ruta' });
Unidad.hasMany(Viaje, { foreignKey: 'unidadId', as: 'viajes' });
Viaje.belongsTo(Unidad, { foreignKey: 'unidadId', as: 'unidad' });

// Relaciones Boleto
Usuario.hasMany(Boleto, { foreignKey: 'usuarioId', as: 'boletos' });
Boleto.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
Viaje.hasMany(Boleto, { foreignKey: 'viajeId', as: 'boletos' });
Boleto.belongsTo(Viaje, { foreignKey: 'viajeId', as: 'viaje' });

// Relaciones PasajeroBoleto
Boleto.hasMany(PasajeroBoleto, { foreignKey: 'boletoId', as: 'pasajeros' });
PasajeroBoleto.belongsTo(Boleto, { foreignKey: 'boletoId', as: 'boleto' });

module.exports = {
    Usuario,
    Cooperativa,
    Ciudad,
    Terminal,
    Conductor,
    Unidad,
    Ruta,
    Viaje,
    Boleto,
    PasajeroBoleto
};