const CooperativasController = require('../controllers/cooperativas.controller');

module.exports = (app) => {
    // Obtener todas las cooperativas
    app.get('/cooperativas', CooperativasController.getAllCooperativas);
    
    // Obtener cooperativa por ID
    app.get('/cooperativas/:id', CooperativasController.getCooperativaById);
    
    // Crear nueva cooperativa
    app.post('/cooperativas', CooperativasController.createCooperativa);
    
    // Actualizar cooperativa
    app.put('/cooperativas/:id', CooperativasController.updateCooperativa);
    
    // Eliminar cooperativa
    app.delete('/cooperativas/:id', CooperativasController.deleteCooperativa);
};