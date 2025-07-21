const axios = require('axios');

async function crearUsuarioTest() {
    try {
        console.log('🧪 Creando usuario de prueba...');
        
        const usuarioNuevo = {
            nombres: "Patricio Vladmir",
            apellidos: "Sánchez Espinoza",
            fechaNacimiento: "2025-06-12", 
            cedula: "1725917451",
            correo: "patriciosanchez67@gmail.com",
            telefono: "0982821204",
            contrasena: "pato123456"
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
}, 2000);
