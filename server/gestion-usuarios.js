// Script para activar usuari    console.log('- Rol:', usuario.rol);

    // Activar según el rol
    if (usuario.rol === 'final') {
      console.log('✅ Usuario final no requiere activación (siempre activo)');
    } else if (usuario.rol === 'cooperativa' && usuario.UsuarioCooperativa) {
      await UsuarioCooperativa.update(
        { estado: 'activo' },
        { where: { usuario_id: usuario.id } }
      );
      console.log('✅ Usuario cooperativa activado exitosamente');
    } else {
      console.log('❌ No se pudo activar: datos específicos del rol no encontrados');
      return false;
    } require('./models/usuario.model');
const UsuarioFinal = require('./models/usuarioFinal.model');
const UsuarioCooperativa = require('./models/usuarioCooperativa.model');

// Cargar asociaciones
require('./models/index');

async function activarUsuario(correo) {
  try {
    console.log(`=== Activando usuario: ${correo} ===`);
    
    // Buscar usuario por correo
    const usuario = await Usuario.findOne({
      where: { correo },
      include: [
        { model: UsuarioFinal },
        { model: UsuarioCooperativa }
      ]
    });

    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return false;
    }

    console.log('Usuario encontrado:');
    console.log('- ID:', usuario.id);
    console.log('- Correo:', usuario.correo);
    console.log('- Rol:', usuario.rol);

    // Activar según el rol
    if (usuario.rol === 'final' && usuario.UsuarioFinal) {
      await UsuarioFinal.update(
        { estado: 'activo' },
        { where: { usuario_id: usuario.id } }
      );
      console.log('✅ Usuario final activado exitosamente');
    } else if (usuario.rol === 'cooperativa' && usuario.UsuarioCooperativa) {
      await UsuarioCooperativa.update(
        { estado: 'activo' },
        { where: { usuario_id: usuario.id } }
      );
      console.log('✅ Usuario cooperativa activado exitosamente');
    } else {
      console.log('❌ No se pudo activar: datos específicos del rol no encontrados');
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error al activar usuario:', error);
    return false;
  }
}

async function desactivarUsuario(correo) {
  try {
    console.log(`=== Desactivando usuario: ${correo} ===`);
    
    // Buscar usuario por correo
    const usuario = await Usuario.findOne({
      where: { correo },
      include: [
        { model: UsuarioFinal },
        { model: UsuarioCooperativa }
      ]
    });

    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return false;
    }

    // Desactivar según el rol
    if (usuario.rol === 'final') {
      console.log('✅ Usuario final no requiere desactivación (siempre activo)');
    } else if (usuario.rol === 'cooperativa' && usuario.UsuarioCooperativa) {
      await UsuarioCooperativa.update(
        { estado: 'desactivo' },
        { where: { usuario_id: usuario.id } }
      );
      console.log('✅ Usuario cooperativa desactivado exitosamente');
    } else {
      console.log('❌ No se pudo desactivar: datos específicos del rol no encontrados');
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error al desactivar usuario:', error);
    return false;
  }
}

async function listarUsuarios() {
  try {
    console.log('=== Lista de todos los usuarios ===');
    
    const usuarios = await Usuario.findAll({
      include: [
        { model: UsuarioFinal },
        { model: UsuarioCooperativa }
      ]
    });

    usuarios.forEach((usuario, index) => {
      console.log(`\n--- Usuario ${index + 1} ---`);
      console.log('ID:', usuario.id);
      console.log('Correo:', usuario.correo);
      console.log('Rol:', usuario.rol);
      
      if (usuario.UsuarioFinal) {
        console.log('Nombre:', `${usuario.UsuarioFinal.nombres} ${usuario.UsuarioFinal.apellidos}`);
        console.log('Estado:', usuario.UsuarioFinal.estado);
      }
      
      if (usuario.UsuarioCooperativa) {
        console.log('Razón Social:', usuario.UsuarioCooperativa.razon_social);
        console.log('Estado:', usuario.UsuarioCooperativa.estado);
      }
    });
    
  } catch (error) {
    console.error('❌ Error al listar usuarios:', error);
  }
}

// Ejecutar según argumentos de línea de comandos
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Uso del script:
  node gestion-usuarios.js listar                  - Listar todos los usuarios
  node gestion-usuarios.js activar <correo>       - Activar un usuario
  node gestion-usuarios.js desactivar <correo>    - Desactivar un usuario

Ejemplos:
  node gestion-usuarios.js listar
  node gestion-usuarios.js activar prueba@test.com
  node gestion-usuarios.js desactivar prueba@test.com
    `);
    process.exit(0);
  }

  const comando = args[0];
  const correo = args[1];

  switch (comando) {
    case 'listar':
      await listarUsuarios();
      break;
    case 'activar':
      if (!correo) {
        console.log('❌ Debes proporcionar un correo para activar');
        process.exit(1);
      }
      await activarUsuario(correo);
      break;
    case 'desactivar':
      if (!correo) {
        console.log('❌ Debes proporcionar un correo para desactivar');
        process.exit(1);
      }
      await desactivarUsuario(correo);
      break;
    default:
      console.log('❌ Comando no reconocido:', comando);
      process.exit(1);
  }

  process.exit(0);
}

main();
