const UsuarioController = require('../controllers/usuario.controller');

module.exports = (app) => {
    // Obtener todos los usuarios
    app.get('/usuarios', UsuarioController.getAllUsuarios);
    
    // Obtener usuario por ID
    app.get('/usuarios/:id', UsuarioController.getUsuarioById);
    
    // Crear nuevo usuario
    app.post('/usuarios', UsuarioController.createUsuario);
    
    // Actualizar usuario
    app.put('/usuarios/:id', UsuarioController.updateUsuario);
    
    // Eliminar usuario
    app.delete('/usuarios/:id', UsuarioController.deleteUsuario);
    
    // Login de usuario
    app.post('/usuarios/login', UsuarioController.loginUsuario);
    
    // Verificar si correo existe
    app.get('/usuarios/verificar-correo/:correo', UsuarioController.verificarCorreo);
    
    // Verificar si cédula existe
    app.get('/usuarios/verificar-cedula/:cedula', UsuarioController.verificarCedula);
    
    // Endpoint especial para actualizar contraseñas planas (solo usar una vez)
    app.post('/usuarios/actualizar-contrasenas-planas', UsuarioController.actualizarContrasenasPlanas);
};