const UnidadesController = require('../controllers/unidades.controller');

module.exports = (app) => {
    // Obtener todas las unidades
    app.get('/unidades', UnidadesController.getAllUnidades);
    
    // Obtener unidades por cooperativa
    app.get('/unidades/cooperativa/:cooperativaId', UnidadesController.getUnidadesByCooperativa);
    
    // Obtener unidad por ID
    app.get('/unidades/:id', UnidadesController.getUnidadById);
    
    // Crear nueva unidad
    app.post('/unidades', UnidadesController.createUnidad);
    
    // Actualizar unidad
    app.put('/unidades/:id', UnidadesController.updateUnidad);
    
    // Eliminar unidad
    app.delete('/unidades/:id', UnidadesController.deleteUnidad);
};