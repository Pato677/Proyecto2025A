const PasajerosController = require('../controllers/pasajeros.controller');

module.exports = function(app){

    // Obtener todos los pasajeros
    app.get('/pasajeros', PasajerosController.obtenerPasajeros);

    // Obtener pasajero por ID
    app.get('/pasajeros/:id', PasajerosController.obtenerPasajeroPorId);

    // Buscar pasajero por cédula
    app.get('/pasajeros/cedula/:cedula', PasajerosController.buscarPasajeroPorCedula);

    // Crear nuevo pasajero
    app.post('/pasajeros', PasajerosController.crearPasajero);
};
