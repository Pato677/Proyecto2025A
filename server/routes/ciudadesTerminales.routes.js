const ciudadesTerminalesController = require('../controllers/ciudadesTerminales.controller');

module.exports = (app) => {
    // Ruta para obtener ciudades con sus terminales agrupados
    app.get('/ciudades-terminales', ciudadesTerminalesController.getCiudadesConTerminales);

    // Ruta para obtener datos planos para tabla (ciudad-terminal por fila)
    app.get('/ciudades-terminales/plano', ciudadesTerminalesController.getCiudadesTerminalesPlano);
};
