const RutasController = require('../controllers/rutas.controller');

module.exports = (app) => {
    // Obtener todas las rutas
    app.get('/rutas', RutasController.getAllRutas);
    
    // Obtener ruta por ID
    app.get('/rutas/:id', RutasController.getRutaById);
    
    // Buscar rutas por origen y destino
    app.get('/rutas/buscar', RutasController.buscarRutas);
    
    // Crear nueva ruta
    app.post('/rutas', RutasController.createRuta);
    
    // Actualizar ruta
    app.put('/rutas/:id', RutasController.updateRuta);
    
    // Eliminar ruta
    app.delete('/rutas/:id', RutasController.deleteRuta);
};