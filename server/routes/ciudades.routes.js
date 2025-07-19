const CiudadesController = require('../controllers/ciudades.controller');

module.exports = (app) => {
    // Obtener todas las ciudades
    app.get('/ciudades', CiudadesController.getAllCiudades);
    
    // Obtener ciudad por ID
    app.get('/ciudades/:id', CiudadesController.getCiudadById);
    
    // Crear nueva ciudad
    app.post('/ciudades', CiudadesController.createCiudad);
    
    // Actualizar ciudad
    app.put('/ciudades/:id', CiudadesController.updateCiudad);
    
    // Eliminar ciudad
    app.delete('/ciudades/:id', CiudadesController.deleteCiudad);
};