const ViajesController = require('../controllers/viajes.controller');

module.exports = (app) => {
    // Obtener todos los viajes
    app.get('/viajes', ViajesController.getAllViajes);
    
    // Obtener viaje por ID
    app.get('/viajes/:id', ViajesController.getViajeById);
    
    // Buscar viajes disponibles
    app.get('/viajes/buscar', ViajesController.buscarViajes);
    
    // Crear nuevo viaje
    app.post('/viajes', ViajesController.createViaje);
    
    // Actualizar viaje
    app.put('/viajes/:id', ViajesController.updateViaje);
    
    // Eliminar viaje
    app.delete('/viajes/:id', ViajesController.deleteViaje);
};