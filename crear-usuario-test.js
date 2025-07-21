const bcrypt = require('bcrypt');
const axios = require('axios');

async function crearUsuarioTest() {
    try {
        const usuarioTest = {
            nombres: "Usuario",
            apellidos: "Prueba",
            fechaNacimiento: "1990-01-01",
            cedula: "1234567890",
            correo: "pa2@gmail.com",
            telefono: "0987654321",
            contrasena: "123456"
        };

        console.log('Creando usuario de prueba...');
        
        const response = await axios.post('http://localhost:3000/usuarios', usuarioTest);
        console.log('✅ Usuario creado exitosamente:', response.data);
        
    } catch (error) {
        if (error.response) {
            console.error('❌ Error del servidor:', error.response.data);
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

crearUsuarioTest();
