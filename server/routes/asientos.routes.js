const AsientosController = require('../controllers/asientos.controller');

module.exports = function(app){
    // Obtener todos los asientos
    app.get('/asientos', AsientosController.getAllAsientos);
    
    // Obtener asientos ocupados por viaje
    app.get('/asientos/ocupados/:viajeId', AsientosController.getAsientosOcupados);
};
