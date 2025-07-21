const bcrypt = require('bcrypt');
const { Usuario } = require('./server/models');

async function fixPasswords() {
    try {
        console.log('Iniciando corrección de contraseñas...');
        
        // Obtener todos los usuarios
        const usuarios = await Usuario.findAll();
        
        for (let usuario of usuarios) {
            const contrasenaActual = usuario.contrasena;
            
            // Verificar si la contraseña ya está encriptada (bcrypt hashes empiezan con $2a$, $2b$, etc.)
            if (!contrasenaActual.startsWith('$2')) {
                console.log(`Encriptando contraseña para usuario: ${usuario.correo}`);
                
                // Encriptar la contraseña
                const contrasenaEncriptada = await bcrypt.hash(contrasenaActual, 10);
                
                // Actualizar en la base de datos
                await usuario.update({ contrasena: contrasenaEncriptada });
                
                console.log(`✅ Contraseña actualizada para: ${usuario.correo}`);
            } else {
                console.log(`✓ Contraseña ya encriptada para: ${usuario.correo}`);
            }
        }
        
        console.log('✅ Corrección de contraseñas completada');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error al corregir contraseñas:', error);
        process.exit(1);
    }
}

fixPasswords();
