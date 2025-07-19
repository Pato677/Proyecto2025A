const TerminalesController = require('../controllers/terminales.controller');

module.exports = (app) => {
    // Obtener todos los terminales
    app.get('/terminales', TerminalesController.getAllTerminales);
    
    // Obtener terminal por ID
    app.get('/terminales/:id', TerminalesController.getTerminalById);
    
    // Obtener terminales por ciudad
    app.get('/terminales/ciudad/:ciudadId', TerminalesController.getTerminalesByCiudad);
    
    // Crear nuevo terminal
    app.post('/terminales', TerminalesController.createTerminal);
    
    // Actualizar terminal
    app.put('/terminales/:id', TerminalesController.updateTerminal);
    
    // Eliminar terminal
    app.delete('/terminales/:id', TerminalesController.deleteTerminal);
};