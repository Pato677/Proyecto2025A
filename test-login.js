// Eliminar archivo temporal
const fs = require('fs');
setTimeout(() => {
    fs.unlinkSync(__filename);
}, 1000);

// Función de prueba inmediata
const axios = require('axios');

async function testLogin() {
    try {
        console.log('🧪 Probando login con credenciales de la base de datos...');
        
        const credenciales = {
            correo: "pa2@gmail.com",
            contrasena: "123456"
        };
        
        console.log('📤 Enviando solicitud a: http://localhost:3000/usuarios/login');
        console.log('📧 Correo:', credenciales.correo);
        console.log('🔐 Contraseña:', credenciales.contrasena);
        
        const response = await axios.post('http://localhost:3000/usuarios/login', credenciales);
        
        console.log('✅ Login exitoso!');
        console.log('👤 Usuario logueado:', response.data);
        
    } catch (error) {
        if (error.response) {
            console.log('❌ Error del servidor:');
            console.log('Status:', error.response.status);
            console.log('Mensaje:', error.response.data);
        } else if (error.code === 'ECONNREFUSED') {
            console.log('❌ No se pudo conectar al servidor. ¿Está ejecutándose en http://localhost:3000?');
        } else {
            console.log('❌ Error:', error.message);
        }
    }
}

testLogin();
