const RutasController = require('../controllers/rutas.controller');

module.exports = function(app) {
    // Obtener todas las rutas
    app.get('/rutas', RutasController.getAllRutas);
    
    // Obtener rutas por cooperativa
    app.get('/rutas/cooperativa/:cooperativaId', RutasController.getRutasByCooperativa);
};