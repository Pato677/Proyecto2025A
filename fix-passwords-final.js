const axios = require('axios');

async function actualizarContrasenas() {
    try {
        console.log('🔄 Actualizando contraseñas de texto plano a bcrypt...');
        
        const response = await axios.post('http://localhost:3000/usuarios/actualizar-contrasenas-planas');
        
        console.log('✅ Actualización completada!');
        console.log('📊 Resultado:', response.data);
        
        // Ahora probemos login con usuario existente
        console.log('\n🧪 Probando login con usuario existente...');
        
        const loginResponse = await axios.post('http://localhost:3000/usuarios/login', {
            correo: "pa2@gmail.com",
            contrasena: "123456"
        });
        
        console.log('✅ Login exitoso con usuario existente!');
        console.log('👤 Usuario logueado:', loginResponse.data);
        
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

actualizarContrasenas();

// Auto-eliminar este archivo después de usarlo
setTimeout(() => {
    const fs = require('fs');
    fs.unlinkSync(__filename);
}, 3000);
