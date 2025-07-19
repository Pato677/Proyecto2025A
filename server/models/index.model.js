const Usuario = require('./Usuario');
const Cooperativa = require('./Cooperativa');
const Ciudad = require('./Ciudad');
const Terminal = require('./Terminal');
const Conductor = require('./Conductor');
const Unidad = require('./Unidad');
const Ruta = require('./Ruta');
const Viaje = require('./Viaje');
const Boleto = require('./Boleto'); // Cambio aquí
const PasajeroBoleto = require('./PasajeroBoleto'); // Cambio aquí

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

// Relaciones Boleto (anteriormente Reserva)
Usuario.hasMany(Boleto, { foreignKey: 'usuarioId', as: 'boletos' });
Boleto.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
Viaje.hasMany(Boleto, { foreignKey: 'viajeId', as: 'boletos' });
Boleto.belongsTo(Viaje, { foreignKey: 'viajeId', as: 'viaje' });

// Relaciones PasajeroBoleto (anteriormente PasajeroReserva)
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
    Boleto, // Cambio aquí
    PasajeroBoleto // Cambio aquí
};