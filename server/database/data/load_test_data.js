const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importar modelos
const {
  Usuario,
  UsuarioFinal,
  UsuarioCooperativa,
  Ciudad,
  Terminal,
  Conductor,
  Unidad,
  Ruta,
  Viaje,
  Asiento,
  Pasajero,
  Compra,
  Boleto
} = require('../../models');

const sequelize = require('../../config/sequelize.config');

async function cargarDatosPrueba() {
  try {
    console.log('🔄 Iniciando carga de datos de prueba...');

    // 1. Crear ciudades
    console.log('📍 Creando ciudades...');
    const ciudades = await Ciudad.bulkCreate([
      { nombre: 'Quito' },
      { nombre: 'Guayaquil' },
      { nombre: 'Cuenca' },
      { nombre: 'Ambato' },
      { nombre: 'Riobamba' },
      { nombre: 'Loja' },
      { nombre: 'Machala' },
      { nombre: 'Manta' }
    ], { returning: true });

    // 2. Crear terminales
    console.log('🚌 Creando terminales...');
    const terminales = await Terminal.bulkCreate([
      { nombre: 'Terminal Terrestre Quitumbe', direccion: 'Av. Condor Nan y Av. Quitumbe Nan', ciudad_id: ciudades[0].id },
      { nombre: 'Terminal Terrestre Carcelén', direccion: 'Panamericana Norte Km 12', ciudad_id: ciudades[0].id },
      { nombre: 'Terminal Terrestre Guayaquil', direccion: 'Av. Benjamin Rosales y Rio Daule', ciudad_id: ciudades[1].id },
      { nombre: 'Terminal Terrestre Cuenca', direccion: 'Av. España y Av. Gil Ramirez', ciudad_id: ciudades[2].id },
      { nombre: 'Terminal Terrestre Ambato', direccion: 'Av. Los Incas y Av. Indoamerica', ciudad_id: ciudades[3].id },
      { nombre: 'Terminal Terrestre Riobamba', direccion: 'Av. La Prensa y Av. Daniel Leon Borja', ciudad_id: ciudades[4].id },
      { nombre: 'Terminal Terrestre Loja', direccion: 'Av. Gran Colombia y 8 de Diciembre', ciudad_id: ciudades[5].id },
      { nombre: 'Terminal Terrestre Machala', direccion: 'Av. Las Palmeras y Circunvalacion Norte', ciudad_id: ciudades[6].id }
    ], { returning: true });

    // 3. Crear asientos (numeración estándar de bus)
    console.log('💺 Creando asientos...');
    const asientos = [];
    for (let i = 1; i <= 40; i++) {
      asientos.push({ numeracion: i.toString() });
    }
    await Asiento.bulkCreate(asientos);

    // 4. Crear Super Usuario
    console.log('👑 Creando super usuario...');
    const hashedPasswordSuper = await bcrypt.hash('admin2024', 10);
    const superUsuario = await Usuario.create({
      correo: 'admin@transportesec.com',
      contrasena: hashedPasswordSuper,
      telefono: '0999999999',
      rol: 'superuser'
    });

    await UsuarioFinal.create({
      usuario_id: superUsuario.id,
      nombres: 'Administrador',
      apellidos: 'Sistema',
      cedula: '0999999999',
      fecha_nacimiento: '1990-01-01'
    });

    // 5. Crear Usuarios Finales
    console.log('👤 Creando usuarios finales...');
    const usuariosFinales = [
      {
        correo: 'juan.perez@email.com',
        contrasena: 'usuario123',
        telefono: '0987654321',
        nombres: 'Juan Carlos',
        apellidos: 'Pérez González',
        cedula: '1234567890',
        fecha_nacimiento: '1985-03-15'
      },
      {
        correo: 'maria.rodriguez@email.com',
        contrasena: 'usuario123',
        telefono: '0987654322',
        nombres: 'María Elena',
        apellidos: 'Rodríguez López',
        cedula: '1234567891',
        fecha_nacimiento: '1990-07-22'
      },
      {
        correo: 'carlos.sanchez@email.com',
        contrasena: 'usuario123',
        telefono: '0987654323',
        nombres: 'Carlos Alberto',
        apellidos: 'Sánchez Mora',
        cedula: '1234567892',
        fecha_nacimiento: '1988-11-10'
      }
    ];

    for (const userData of usuariosFinales) {
      const hashedPassword = await bcrypt.hash(userData.contrasena, 10);
      const usuario = await Usuario.create({
        correo: userData.correo,
        contrasena: hashedPassword,
        telefono: userData.telefono,
        rol: 'final'
      });

      await UsuarioFinal.create({
        usuario_id: usuario.id,
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        cedula: userData.cedula,
        fecha_nacimiento: userData.fecha_nacimiento
      });
    }

    // 6. Crear Cooperativas
    console.log('🏢 Creando cooperativas...');
    const cooperativas = [
      {
        correo: 'admin@cooperativaandes.com',
        contrasena: 'coop123',
        telefono: '0987654330',
        razon_social: 'Cooperativa de Transportes Andes',
        permiso_operacion: 'PERM-001-2024',
        ruc: '1234567890001',
        estado: 'activo'
      },
      {
        correo: 'gerencia@transcosta.com',
        contrasena: 'coop123',
        telefono: '0987654331',
        razon_social: 'Transportes Costa del Pacífico',
        permiso_operacion: 'PERM-002-2024',
        ruc: '1234567890002',
        estado: 'activo'
      },
      {
        correo: 'info@expresoriente.com',
        contrasena: 'coop123',
        telefono: '0987654332',
        razon_social: 'Expreso Oriente S.A.',
        permiso_operacion: 'PERM-003-2024',
        ruc: '1234567890003',
        estado: 'desactivo' // Una cooperativa desactivada para pruebas
      }
    ];

    const cooperativasCreadas = [];
    for (const coopData of cooperativas) {
      const hashedPassword = await bcrypt.hash(coopData.contrasena, 10);
      const usuario = await Usuario.create({
        correo: coopData.correo,
        contrasena: hashedPassword,
        telefono: coopData.telefono,
        rol: 'cooperativa'
      });

      const cooperativa = await UsuarioCooperativa.create({
        usuario_id: usuario.id,
        razon_social: coopData.razon_social,
        permiso_operacion: coopData.permiso_operacion,
        ruc: coopData.ruc,
        estado: coopData.estado
      });

      cooperativasCreadas.push(cooperativa);
    }

    // 7. Crear Conductores
    console.log('🚗 Creando conductores...');
    const conductores = await Conductor.bulkCreate([
      {
        nombre: 'Luis Fernando Morales',
        identificacion: '1234567890',
        tipo_licencia: 'Tipo E',
        telefono: '0987654340',
        correo: 'luis.morales@email.com'
      },
      {
        nombre: 'Pedro Antonio Vargas',
        identificacion: '1234567891',
        tipo_licencia: 'Tipo E',
        telefono: '0987654341',
        correo: 'pedro.vargas@email.com'
      },
      {
        nombre: 'Miguel Angel Castro',
        identificacion: '1234567892',
        tipo_licencia: 'Tipo E',
        telefono: '0987654342',
        correo: 'miguel.castro@email.com'
      },
      {
        nombre: 'Roberto Carlos Jiménez',
        identificacion: '1234567893',
        tipo_licencia: 'Tipo E',
        telefono: '0987654343',
        correo: 'roberto.jimenez@email.com'
      },
      {
        nombre: 'Fernando José Mendoza',
        identificacion: '1234567894',
        tipo_licencia: 'Tipo E',
        telefono: '0987654344',
        correo: 'fernando.mendoza@email.com'
      },
      {
        nombre: 'Diego Armando Herrera',
        identificacion: '1234567895',
        tipo_licencia: 'Tipo E',
        telefono: '0987654345',
        correo: 'diego.herrera@email.com'
      }
    ], { returning: true });

    // 8. Crear Unidades
    console.log('🚌 Creando unidades...');
    const unidades = await Unidad.bulkCreate([
      {
        placa: 'ABC-1234',
        numero_unidad: 101,
        imagen_path: '/images/unidades/bus101.jpg',
        cooperativa_id: cooperativasCreadas[0].id,
        conductor_id: conductores[0].id,
        controlador_id: conductores[1].id
      },
      {
        placa: 'DEF-5678',
        numero_unidad: 102,
        imagen_path: '/images/unidades/bus102.jpg',
        cooperativa_id: cooperativasCreadas[0].id,
        conductor_id: conductores[2].id,
        controlador_id: conductores[3].id
      },
      {
        placa: 'GHI-9012',
        numero_unidad: 201,
        imagen_path: '/images/unidades/bus201.jpg',
        cooperativa_id: cooperativasCreadas[1].id,
        conductor_id: conductores[4].id,
        controlador_id: conductores[5].id
      }
    ], { returning: true });

    // 9. Crear Rutas
    console.log('🛣️ Creando rutas...');
    const rutas = await Ruta.bulkCreate([
      {
        numero_ruta: 'R001',
        hora_salida: '06:00:00',
        hora_llegada: '14:00:00',
        cooperativa_id: cooperativasCreadas[0].id,
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          { nombre: 'Latacunga', hora: '08:00' },
          { nombre: 'Ambato', hora: '09:30' },
          { nombre: 'Riobamba', hora: '11:00' }
        ])
      },
      {
        numero_ruta: 'R002',
        hora_salida: '07:30:00',
        hora_llegada: '12:30:00',
        cooperativa_id: cooperativasCreadas[0].id,
        terminal_origen_id: terminales[1].id, // Carcelén
        terminal_destino_id: terminales[3].id, // Cuenca
        paradas: JSON.stringify([
          { nombre: 'Ambato', hora: '09:00' },
          { nombre: 'Riobamba', hora: '10:30' }
        ])
      },
      {
        numero_ruta: 'R003',
        hora_salida: '08:00:00',
        hora_llegada: '16:00:00',
        cooperativa_id: cooperativasCreadas[1].id,
        terminal_origen_id: terminales[2].id, // Guayaquil
        terminal_destino_id: terminales[6].id, // Loja
        paradas: JSON.stringify([
          { nombre: 'Machala', hora: '10:00' },
          { nombre: 'Cuenca', hora: '13:00' }
        ])
      }
    ], { returning: true });

    // 10. Crear Viajes
    console.log('✈️ Creando viajes...');
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    const pasadoManana = new Date(hoy);
    pasadoManana.setDate(hoy.getDate() + 2);

    const viajes = await Viaje.bulkCreate([
      {
        fecha_salida: new Date(`${manana.toISOString().split('T')[0]} 06:00:00`),
        fecha_llegada: new Date(`${manana.toISOString().split('T')[0]} 14:00:00`),
        numero_asientos_ocupados: 0,
        precio: 25.50,
        ruta_id: rutas[0].id,
        unidad_id: unidades[0].id
      },
      {
        fecha_salida: new Date(`${pasadoManana.toISOString().split('T')[0]} 07:30:00`),
        fecha_llegada: new Date(`${pasadoManana.toISOString().split('T')[0]} 12:30:00`),
        numero_asientos_ocupados: 0,
        precio: 18.75,
        ruta_id: rutas[1].id,
        unidad_id: unidades[1].id
      },
      {
        fecha_salida: new Date(`${manana.toISOString().split('T')[0]} 08:00:00`),
        fecha_llegada: new Date(`${manana.toISOString().split('T')[0]} 16:00:00`),
        numero_asientos_ocupados: 0,
        precio: 32.00,
        ruta_id: rutas[2].id,
        unidad_id: unidades[2].id
      }
    ], { returning: true });

    // 11. Crear algunos pasajeros de ejemplo
    console.log('👥 Creando pasajeros de ejemplo...');
    const pasajeros = await Pasajero.bulkCreate([
      {
        nombres: 'Ana María',
        apellidos: 'García Vega',
        fecha_nacimiento: '1992-05-18',
        cedula: '0987654321'
      },
      {
        nombres: 'José Luis',
        apellidos: 'Martínez Silva',
        fecha_nacimiento: '1985-09-25',
        cedula: '0987654322'
      },
      {
        nombres: 'Laura Patricia',
        apellidos: 'Hernández Ruiz',
        fecha_nacimiento: '1995-12-03',
        cedula: '0987654323'
      }
    ], { returning: true });

    // 12. Crear algunas compras de ejemplo
    console.log('🛒 Creando compras de ejemplo...');
    const compras = await Compra.bulkCreate([
      {
        fecha: new Date(),
        email_contacto: 'ana.garcia@email.com',
        telefono_contacto: '0987654321',
        pasajero_id: pasajeros[0].id,
        viaje_id: viajes[0].id
      },
      {
        fecha: new Date(),
        email_contacto: 'jose.martinez@email.com',
        telefono_contacto: '0987654322',
        pasajero_id: pasajeros[1].id,
        viaje_id: viajes[1].id
      }
    ], { returning: true });

    // 13. Crear boletos para las compras
    console.log('🎫 Creando boletos...');
    await Boleto.bulkCreate([
      {
        codigo: `BOL-${Date.now()}-001`,
        valor: 25.50,
        compra_id: compras[0].id,
        pasajero_id: pasajeros[0].id
      },
      {
        codigo: `BOL-${Date.now()}-002`,
        valor: 18.75,
        compra_id: compras[1].id,
        pasajero_id: pasajeros[1].id
      }
    ]);

    console.log('✅ Datos de prueba cargados exitosamente!');
    console.log('\n📊 RESUMEN DE DATOS CREADOS:');
    console.log(`   🏙️ Ciudades: ${ciudades.length}`);
    console.log(`   🚌 Terminales: ${terminales.length}`);
    console.log(`   💺 Asientos: ${asientos.length}`);
    console.log(`   👑 Super usuarios: 1`);
    console.log(`   👤 Usuarios finales: ${usuariosFinales.length}`);
    console.log(`   🏢 Cooperativas: ${cooperativas.length}`);
    console.log(`   🚗 Conductores: ${conductores.length}`);
    console.log(`   🚌 Unidades: ${unidades.length}`);
    console.log(`   🛣️ Rutas: ${rutas.length}`);
    console.log(`   ✈️ Viajes: ${viajes.length}`);
    console.log(`   👥 Pasajeros: ${pasajeros.length}`);
    console.log(`   🛒 Compras: ${compras.length}`);
    console.log(`   🎫 Boletos: 2`);

    console.log('\n🔐 CREDENCIALES DE ACCESO:');
    console.log('   Super Usuario:');
    console.log('     📧 Email: admin@transportesec.com');
    console.log('     🔑 Contraseña: admin2024');
    console.log('\n   Usuario Final (ejemplo):');
    console.log('     📧 Email: juan.perez@email.com');
    console.log('     🔑 Contraseña: usuario123');
    console.log('\n   Cooperativa Activa:');
    console.log('     📧 Email: admin@cooperativaandes.com');
    console.log('     🔑 Contraseña: coop123');
    console.log('\n   Cooperativa Desactivada:');
    console.log('     📧 Email: info@expresoriente.com');
    console.log('     🔑 Contraseña: coop123');

  } catch (error) {
    console.error('❌ Error al cargar datos de prueba:', error);
    throw error;
  }
}

// Función principal para ejecutar el script
async function main() {
  try {
    console.log('🚀 CARGA DE DATOS DE PRUEBA - SISTEMA DE TRANSPORTE');
    console.log('=================================================\n');
    
    await cargarDatosPrueba();
    
    console.log('\n🎉 ¡Carga de datos completada exitosamente!');
    console.log('💡 Ahora puedes probar el sistema con los datos cargados');
    
  } catch (error) {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { cargarDatosPrueba };
