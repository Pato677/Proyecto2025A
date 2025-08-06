const comprasController = require('../controllers/compras.controller');

module.exports = function(app){

    // POST /api/compras - Crear compra completa
    app.post('/compras', comprasController.crearCompraCompleta);

    // GET /api/compras - Obtener todas las compras
    app.get('/compras', comprasController.obtenerCompras);

    // GET /api/compras/:id - Obtener compra por ID
    app.get('/compras/:id', comprasController.obtenerCompraPorId);

    // POST /api/compras/verificar-asientos - Verificar disponibilidad de asientos
    app.post('/compras/verificar-asientos', comprasController.verificarDisponibilidadAsientos);
};
