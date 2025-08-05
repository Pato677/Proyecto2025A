const BoletosController = require('../controllers/boletos.controller');

module.exports = (app) => {
    // Obtener todos los boletos
    app.get('/boletos', BoletosController.getAllBoletos);
    
    // Obtener boleto por ID
    app.get('/boletos/:id', BoletosController.getBoletosById);
    
    // Obtener boletos por usuario
    app.get('/boletos/usuario/:usuarioId', BoletosController.getBoletosByPasajero);
    
    // Crear nuevo boleto
    app.post('/boletos', BoletosController.createBoleto);
    
    // Actualizar boleto
    app.put('/boletos/:id', BoletosController.updateBoleto);


};