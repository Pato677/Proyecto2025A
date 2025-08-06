const UnidadesController = require('../controllers/unidades.controller');

module.exports = (app) => {
    // Obtener unidades por cooperativa/ FUNCIONA
    app.get('/unidades/cooperativa/:cooperativaId', UnidadesController.getUnidadesByCooperativa);
    
    // Crear nueva unidad por cooperativa -- FUNCIONA
    app.post('/unidades/cooperativa', UnidadesController.createUnidad);
    
    // Actualizar unidad -- FUNCIONA
    app.put('/unidades/:id', UnidadesController.updateUnidad);

    // Eliminar unidad -- FUNCIONA
    app.delete('/unidades/:id', UnidadesController.deleteUnidad);

    // EXTRAS
        // Obtener todas las unidades
    app.get('/unidades', UnidadesController.getAllUnidades);

        // Obtener unidad por ID
    app.get('/unidades/:id', UnidadesController.getUnidadById);
};