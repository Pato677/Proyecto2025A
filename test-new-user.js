const axios = require('axios');

async function crearUsuarioTest() {
    try {
        console.log('🧪 Creando usuario de prueba...');
        
        const timestamp = Date.now();
        const usuarioNuevo = {
            nombres: "Test",
            apellidos: "Usuario",
            fechaNacimiento: "1990-01-01", 
            cedula: `12345${timestamp.toString().slice(-5)}`, // Cédula única
            correo: `test${timestamp}@example.com`, // Correo único
            telefono: "0999999999",
            contrasena: "123456"
        };
        
        console.log('📤 Creando usuario:', usuarioNuevo.correo);
        
        const response = await axios.post('http://localhost:3000/usuarios', usuarioNuevo);
        
        console.log('✅ Usuario creado exitosamente!');
        console.log('👤 Usuario:', response.data);
        
        console.log('\n🧪 Ahora probando login...');
        
        const loginResponse = await axios.post('http://localhost:3000/usuarios/login', {
            correo: usuarioNuevo.correo,
            contrasena: usuarioNuevo.contrasena
        });
        
        console.log('✅ Login exitoso!');
        console.log('👤 Usuario logueado:', loginResponse.data);
        
        console.log('\n🎯 RESULTADO: El login funciona correctamente con usuarios nuevos (contraseña encriptada)');
        console.log('💡 El problema es que los usuarios existentes tienen contraseñas en texto plano');
        
    } catch (error) {
        if (error.response) {
            console.log('❌ Error del servidor:');
            console.log('Status:', error.response.status);
            console.log('Mensaje:', error.response.data);
        } else {
            console.log('❌ Error:', error.message);
        }
    }
}

crearUsuarioTest();

// Auto-eliminar este archivo después de usarlo
setTimeout(() => {
    const fs = require('fs');
    fs.unlinkSync(__filename);
}, 3000);
