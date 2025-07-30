const RutasController = require('../controllers/rutas.controller');

module.exports = function(app) {
    // Obtener todas las rutas con paginación
    app.get('/rutas', RutasController.getAllRutas);
    
    // Obtener ruta por ID
    app.get('/rutas/:id', RutasController.getRutaById);
    
    // Obtener rutas por cooperativa con paginación
    app.get('/rutas/cooperativa/:cooperativaId', RutasController.getRutasByCooperativa);
    
    // Obtener cooperativas disponibles
    app.get('/cooperativas', RutasController.getCooperativas);
    
    // Obtener terminales disponibles para usar como paradas
    app.get('/terminales-paradas', RutasController.getTerminalesParaParadas);
    
    // Crear nueva ruta
    app.post('/rutas', RutasController.createRuta);
    
    // Actualizar ruta
    app.put('/rutas/:id', RutasController.updateRuta);
    
    // Actualizar solo paradas de una ruta
    app.put('/rutas/:id/paradas', RutasController.updateParadas);
    
    // Eliminar ruta
    app.delete('/rutas/:id', RutasController.deleteRuta);
};