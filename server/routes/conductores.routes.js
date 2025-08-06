const ConductoresController = require('../controllers/conductores.controller');

module.exports = (app) => {
    // Obtener todos los conductores -- FUNCIONA
    app.get('/conductores', ConductoresController.getAllConductores);
    
    // Obtener conductor por ID
    app.get('/conductores/:id', ConductoresController.getConductorById);
    
    // Crear nuevo conductor
    app.post('/conductores', ConductoresController.createConductor);
    
    // Actualizar conductor
    app.put('/conductores/:id', ConductoresController.updateConductor);
    
    // Eliminar conductor
    app.delete('/conductores/:id', ConductoresController.deleteConductor);
};