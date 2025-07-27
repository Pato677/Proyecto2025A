const ViajesController = require('../controllers/viajes.controller');

module.exports = function(app){
    // Obtener viajes por cooperativa
    app.get('/viajes/cooperativa/:cooperativaId', ViajesController.getViajesByCooperativa);

    // Obtener viaje por ID
    app.get('/viajes/:id', ViajesController.getViajeById);
    
    // Obtener asientos ocupados por viaje
    app.get('/viajes/:id/asientos-ocupados', ViajesController.getAsientosOcupados);

    // Crear nuevo viaje
    app.post('/viajes', ViajesController.createViaje);

    // Actualizar viaje
    app.put('/viajes/:id', ViajesController.updateViaje);

    // Eliminar viaje
    app.delete('/viajes/:id', ViajesController.deleteViaje);
};