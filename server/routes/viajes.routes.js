const ViajesController = require('../controllers/viajes.controller');

module.exports = function(app){


    // Obtener viajes por cooperativa (todos)
    app.get('/viajes/cooperativa/:cooperativaId', ViajesController.getViajesByCooperativa);

    // Obtener viajes vigentes por cooperativa (solo futuros)
    app.get('/viajes/cooperativa/:cooperativaId/vigentes', ViajesController.getViajesVigentesByCooperativa);

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

    // AGREGAR: Endpoint para obtener precio mínimo
    app.get('/viajes/precio-minimo', ViajesController.getPrecioMinimo);
};