/*
 * Script de carga de datos de prueba para el sistema de transportes
 * 
 * MODIFICACIONES RECIENTES:
 * - ✅ Asientos creados como INTEGER en lugar de string
 * - ✅ Viajes inician con numero_asientos_ocupados = 0
 * - ✅ Se crean registros ViajeAsiento para simular asientos ocupados
 * - ✅ Se actualiza numero_asientos_ocupados basado en registros ViajeAsiento
 * - ✅ Función asientoAleatorio() devuelve INTEGER
 * - ✅ Agregado ViajeAsiento a las importaciones
 * 
 * FLUJO:
 * 1. Crear viajes con 0 asientos ocupados inicialmente
 * 2. Para cada viaje, generar aleatoriamente algunos asientos ocupados
 * 3. Crear registros en la tabla viaje_asientos
 * 4. Actualizar numero_asientos_ocupados con la cantidad real
 */

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
  ViajeAsiento,
  Pasajero,
  Compra,
  Boleto
} = require('../../models');

const sequelize = require('../../config/sequelize.config');

async function cargarDatosPrueba() {
  try {
    console.log('🔄 Iniciando carga de datos de prueba...');

    // 1. Crear ciudades (expandido para coincidir con db.json)
    console.log('📍 Creando ciudades...');
    const ciudades = await Ciudad.bulkCreate([
      { nombre: 'Quito' },
      { nombre: 'Guayaquil' },
      { nombre: 'Cuenca' },
      { nombre: 'Ambato' },
      { nombre: 'Riobamba' },
      { nombre: 'Loja' },
      { nombre: 'Machala' },
      { nombre: 'Manta' },
      { nombre: 'Ibarra' },
      { nombre: 'Babahoyo' },
      { nombre: 'Portoviejo' },
      { nombre: 'Santo Domingo' },
      { nombre: 'Durán' },
      { nombre: 'Atacames' },
      { nombre: 'Baños' },
      { nombre: 'Coca' },
      { nombre: 'Macas' },
      { nombre: 'Puyo' },
      { nombre: 'Quevedo' },
      { nombre: 'Tulcán' }
    ], { returning: true });

    // 2. Crear terminales (expandido con más terminales)
    console.log('🚌 Creando terminales...');
    const terminales = await Terminal.bulkCreate([
      // Quito
      { nombre: 'Terminal Terrestre Quitumbe', direccion: 'Av. Condor Nan y Av. Quitumbe Nan', ciudad_id: ciudades[0].id },
      { nombre: 'Terminal Terrestre Carcelén', direccion: 'Panamericana Norte Km 12', ciudad_id: ciudades[0].id },
      // Guayaquil
      { nombre: 'Terminal Terrestre de Guayaquil', direccion: 'Av. Benjamin Rosales y Rio Daule', ciudad_id: ciudades[1].id },
      // Cuenca
      { nombre: 'Terminal Terrestre de Cuenca', direccion: 'Av. España y Av. Gil Ramirez', ciudad_id: ciudades[2].id },
      // Ambato
      { nombre: 'Terminal Terrestre de Ambato', direccion: 'Av. Los Incas y Av. Indoamerica', ciudad_id: ciudades[3].id },
      // Riobamba
      { nombre: 'Terminal Terrestre de Riobamba', direccion: 'Av. La Prensa y Av. Daniel Leon Borja', ciudad_id: ciudades[4].id },
      // Loja
      { nombre: 'Terminal Terrestre de Loja', direccion: 'Av. Gran Colombia y 8 de Diciembre', ciudad_id: ciudades[5].id },
      // Machala
      { nombre: 'Terminal Terrestre de Machala', direccion: 'Av. Las Palmeras y Circunvalacion Norte', ciudad_id: ciudades[6].id },
      // Manta
      { nombre: 'Terminal Terrestre de Manta', direccion: 'Av. 4 de Noviembre y Circunvalacion', ciudad_id: ciudades[7].id },
      // Ibarra
      { nombre: 'Terminal Terrestre de Ibarra', direccion: 'Av. Eugenio Espejo y Av. Mariano Acosta', ciudad_id: ciudades[8].id },
      // Babahoyo
      { nombre: 'Terminal Terrestre de Babahoyo', direccion: 'Av. 10 de Agosto y Eloy Alfaro', ciudad_id: ciudades[9].id },
      // Portoviejo
      { nombre: 'Terminal Terrestre de Portoviejo', direccion: 'Av. Manabi y Circunvalacion', ciudad_id: ciudades[10].id },
      // Santo Domingo
      { nombre: 'Terminal Terrestre de Santo Domingo', direccion: 'Av. Quito y Rio Toachi', ciudad_id: ciudades[11].id },
      // Durán
      { nombre: 'Terminal Terrestre de Durán', direccion: 'Av. Nicolas Lapenti y Eloy Alfaro', ciudad_id: ciudades[12].id },
      // Atacames
      { nombre: 'Terminal Terrestre de Atacames', direccion: 'Av. Kennedy y Malecón', ciudad_id: ciudades[13].id },
      // Baños
      { nombre: 'Terminal Terrestre de Baños', direccion: 'Av. Amazonas y Espejo', ciudad_id: ciudades[14].id },
      // Coca
      { nombre: 'Terminal Terrestre de Coca', direccion: 'Av. 9 de Octubre y Napo', ciudad_id: ciudades[15].id },
      // Macas
      { nombre: 'Terminal Terrestre de Macas', direccion: 'Av. 29 de Mayo y Amazonas', ciudad_id: ciudades[16].id },
      // Puyo
      { nombre: 'Terminal Terrestre de Puyo', direccion: 'Av. Alberto Zambrano y 27 de Febrero', ciudad_id: ciudades[17].id },
      // Quevedo
      { nombre: 'Terminal Terrestre de Quevedo', direccion: 'Av. June Guzman y 7ma Calle', ciudad_id: ciudades[18].id },
      // Tulcán
      { nombre: 'Terminal Terrestre de Tulcán', direccion: 'Av. Veintimilla y Bolivar', ciudad_id: ciudades[19].id }
    ], { returning: true });

    // 3. Crear asientos (numeración estándar de bus)
    console.log('💺 Creando asientos...');
    const asientos = [];
    for (let i = 1; i <= 44; i++) { // Aumentado para buses de 2 pisos
      asientos.push({ numeracion: i });
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

    // 6. Crear Cooperativas (expandido con más empresas)
    console.log('🏢 Creando cooperativas...');
    const cooperativas = [
      {
        correo: 'admin@velotax.com',
        contrasena: 'coop123',
        telefono: '0987654330',
        razon_social: 'Cooperativa Velotax',
        permiso_operacion: 'PERM-001-2024',
        ruc: '1234567890001',
        estado: 'activo'
      },
      {
        correo: 'gerencia@panamericana.com',
        contrasena: 'coop123',
        telefono: '0987654331',
        razon_social: 'Cooperativa Panamericana',
        permiso_operacion: 'PERM-002-2024',
        ruc: '1234567890002',
        estado: 'activo'
      },
      {
        correo: 'info@flotaimbabura.com',
        contrasena: 'coop123',
        telefono: '0987654332',
        razon_social: 'Flota Imbabura',
        permiso_operacion: 'PERM-003-2024',
        ruc: '1234567890003',
        estado: 'activo'
      },
      {
        correo: 'admin@transloja.com',
        contrasena: 'coop123',
        telefono: '0987654333',
        razon_social: 'Transportes Loja',
        permiso_operacion: 'PERM-004-2024',
        ruc: '1234567890004',
        estado: 'activo'
      },
      {
        correo: 'info@santa.com',
        contrasena: 'coop123',
        telefono: '0987654334',
        razon_social: 'Cooperativa Santa',
        permiso_operacion: 'PERM-005-2024',
        ruc: '1234567890005',
        estado: 'activo'
      },
      {
        correo: 'admin@esmeraldas.com',
        contrasena: 'coop123',
        telefono: '0987654335',
        razon_social: 'Cooperativa Esmeraldas',
        permiso_operacion: 'PERM-006-2024',
        ruc: '1234567890006',
        estado: 'activo'
      },
      {
        correo: 'info@ciferal.com',
        contrasena: 'coop123',
        telefono: '0987654336',
        razon_social: 'CIFERAL',
        permiso_operacion: 'PERM-007-2024',
        ruc: '1234567890007',
        estado: 'activo'
      },
      {
        correo: 'admin@reinadelcamino.com',
        contrasena: 'coop123',
        telefono: '0987654337',
        razon_social: 'Reina del Camino',
        permiso_operacion: 'PERM-008-2024',
        ruc: '1234567890008',
        estado: 'activo'
      },
      {
        correo: 'info@andina.com',
        contrasena: 'coop123',
        telefono: '0987654338',
        razon_social: 'Cooperativa Andina',
        permiso_operacion: 'PERM-009-2024',
        ruc: '1234567890009',
        estado: 'activo'
      },
      {
        correo: 'admin@sancristobal.com',
        contrasena: 'coop123',
        telefono: '0987654339',
        razon_social: 'San Cristóbal',
        permiso_operacion: 'PERM-010-2024',
        ruc: '1234567890010',
        estado: 'activo'
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

    // 7. Crear Conductores (expandido)
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
      },
      {
        nombre: 'Carlos Eduardo Torres',
        identificacion: '1234567896',
        tipo_licencia: 'Tipo E',
        telefono: '0987654346',
        correo: 'carlos.torres@email.com'
      },
      {
        nombre: 'Ana María Rodríguez',
        identificacion: '1234567897',
        tipo_licencia: 'Tipo E',
        telefono: '0987654347',
        correo: 'ana.rodriguez@email.com'
      },
      {
        nombre: 'José Luis García',
        identificacion: '1234567898',
        tipo_licencia: 'Tipo E',
        telefono: '0987654348',
        correo: 'jose.garcia@email.com'
      },
      {
        nombre: 'María Elena Vásquez',
        identificacion: '1234567899',
        tipo_licencia: 'Tipo E',
        telefono: '0987654349',
        correo: 'maria.vasquez@email.com'
      },
      {
        nombre: 'Patricio Andrés Silva',
        identificacion: '1234567800',
        tipo_licencia: 'N/A',
        telefono: '0987654350',
        correo: 'patricio.silva@email.com'
      },
      {
        nombre: 'Lucía Isabel Moreno',
        identificacion: '1234567801',
        tipo_licencia: 'N/A',
        telefono: '0987654351',
        correo: 'lucia.moreno@email.com'
      },
      {
        nombre: 'Javier Francisco León',
        identificacion: '1234567802',
        tipo_licencia: 'N/A',
        telefono: '0987654352',
        correo: 'javier.leon@email.com'
      },
      {
        nombre: 'Sofía Alejandra Ruiz',
        identificacion: '1234567803',
        tipo_licencia: 'N/A',
        telefono: '0987654353',
        correo: 'sofia.ruiz@email.com'
      },
      {
        nombre: 'Ricardo Esteban Pérez',
        identificacion: '1234567804',
        tipo_licencia: 'N/A',
        telefono: '0987654354',
        correo: 'ricardo.perez@email.com'
      }
    ], { returning: true });

    // 8. Crear Unidades (expandido con más buses)
    console.log('🚌 Creando unidades...');
    const unidades = await Unidad.bulkCreate([
      {
        placa: 'PBXZ1234',
        numero_unidad: 20,
        imagen_path: 'https://carroceriasjacome.com/images/buses/santa-martha_2.jpg',
        cooperativa_id: cooperativasCreadas[0].id,
        conductor_id: conductores[0].id,
        controlador_id: conductores[10].id
      },
      {
        placa: 'ABC1234',
        numero_unidad: 21,
        imagen_path: 'https://multipasajes.travel/wp-content/uploads/2021/06/velotax1.jpg',
        cooperativa_id: cooperativasCreadas[1].id,
        conductor_id: conductores[1].id,
        controlador_id: conductores[11].id
      },
      {
        placa: 'XYZ5678',
        numero_unidad: 22,
        imagen_path: 'https://multipasajes.travel/wp-content/uploads/2019/07/cristobal1.jpg',
        cooperativa_id: cooperativasCreadas[2].id,
        conductor_id: conductores[2].id,
        controlador_id: conductores[12].id
      },
      {
        placa: 'DEF4321',
        numero_unidad: 23,
        imagen_path: 'https://movilidadmanta.gob.ec/imagenes_cooperativa/cooperativa202407235307.jpg',
        cooperativa_id: cooperativasCreadas[3].id,
        conductor_id: conductores[3].id,
        controlador_id: conductores[13].id
      },
      {
        placa: 'GHI8765',
        numero_unidad: 24,
        imagen_path: 'https://multipasajes.travel/wp-content/uploads/2020/11/macuchi2.jpg',
        cooperativa_id: cooperativasCreadas[4].id,
        conductor_id: conductores[4].id,
        controlador_id: conductores[14].id
      },
      {
        placa: 'JKL2468',
        numero_unidad: 25,
        imagen_path: 'https://multipasajes.travel/wp-content/uploads/2020/11/cita5.jpg',
        cooperativa_id: cooperativasCreadas[5].id,
        conductor_id: conductores[5].id,
        controlador_id: conductores[10].id
      },
      {
        placa: 'MNO1357',
        numero_unidad: 26,
        imagen_path: 'https://multipasajes.travel/wp-content/uploads/2020/11/azuay-head.jpg',
        cooperativa_id: cooperativasCreadas[6].id,
        conductor_id: conductores[6].id,
        controlador_id: conductores[11].id
      },
      {
        placa: 'PQR9753',
        numero_unidad: 27,
        imagen_path: 'https://multipasajes.travel/wp-content/uploads/2021/06/velotax1.jpg',
        cooperativa_id: cooperativasCreadas[7].id,
        conductor_id: conductores[7].id,
        controlador_id: conductores[12].id
      },
      {
        placa: 'STU8642',
        numero_unidad: 28,
        imagen_path: 'https://multipasajes.travel/wp-content/uploads/2020/11/Vencedores4.jpg',
        cooperativa_id: cooperativasCreadas[8].id,
        conductor_id: conductores[8].id,
        controlador_id: conductores[13].id
      },
      {
        placa: 'VWX7531',
        numero_unidad: 29,
        imagen_path: 'https://multipasajes.travel/wp-content/uploads/2020/11/expreso1.jpeg',
        cooperativa_id: cooperativasCreadas[9].id,
        conductor_id: conductores[9].id,
        controlador_id: conductores[14].id
      }
    ], { returning: true });

    // 9. Crear Rutas (con paradas como array de strings, compatibles con Leaflet)
    console.log('🛣️ Creando rutas...');
    const rutas = await Ruta.bulkCreate([
      // Rutas Quito - Guayaquil
      {
        numero_ruta: 'R001',
        hora_salida: '13:30:00',
        hora_llegada: '21:30:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Guayaquil",
          "Avenida Velasco Ibarra, La Tola, Itchimbia, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "De los Milagros, Centro Histórico, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "Lex & Justice, Río de Janeiro, Larrea, San Juan, Quito, Distrito Metropolitano de Quito, Pichincha, 170118, Ecuador"
        ])
      },
      // NUEVAS RUTAS PARA VELOTAX (cooperativa_id = 1)
      {
        numero_ruta: 'R011',
        hora_salida: '06:00:00',
        hora_llegada: '14:00:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Guayaquil",
          "Aloag, Ecuador",
          "Machachi, Ecuador",
          "Latacunga, Ecuador",
          "Babahoyo, Ecuador"
        ])
      },
      {
        numero_ruta: 'R012',
        hora_salida: '08:15:00',
        hora_llegada: '16:15:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[1].id, // Carcelén
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Carcelén",
          "Terminal Terrestre de Guayaquil",
          "Otavalo, Ecuador",
          "Ibarra, Ecuador",
          "Tulcán, Ecuador",
          "Santo Domingo, Ecuador"
        ])
      },
      {
        numero_ruta: 'R013',
        hora_salida: '10:45:00',
        hora_llegada: '18:45:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[3].id, // Cuenca
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Cuenca",
          "Machachi, Ecuador",
          "Latacunga, Ecuador",
          "Ambato, Ecuador",
          "Riobamba, Ecuador",
          "Azogues, Ecuador"
        ])
      },
      {
        numero_ruta: 'R014',
        hora_salida: '14:30:00',
        hora_llegada: '20:30:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[6].id, // Loja
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Loja",
          "Latacunga, Ecuador",
          "Riobamba, Ecuador",
          "Cuenca, Ecuador",
          "Catamayo, Ecuador"
        ])
      },
      {
        numero_ruta: 'R015',
        hora_salida: '16:00:00',
        hora_llegada: '22:00:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[1].id, // Carcelén
        terminal_destino_id: terminales[8].id, // Manta
        paradas: JSON.stringify([
          "Terminal Terrestre Carcelén",
          "Terminal Terrestre de Manta",
          "Otavalo, Ecuador",
          "Ibarra, Ecuador",
          "Santo Domingo, Ecuador",
          "Portoviejo, Ecuador"
        ])
      },
      {
        numero_ruta: 'R016',
        hora_salida: '18:20:00',
        hora_llegada: '02:20:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[7].id, // Machala
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Machala",
          "Aloag, Ecuador",
          "Latacunga, Ecuador",
          "Riobamba, Ecuador",
          "Cuenca, Ecuador",
          "El Oro, Ecuador"
        ])
      },
      {
        numero_ruta: 'R017',
        hora_salida: '20:15:00',
        hora_llegada: '04:15:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[1].id, // Carcelén
        terminal_destino_id: terminales[9].id, // Ibarra
        paradas: JSON.stringify([
          "Terminal Terrestre Carcelén",
          "Terminal Terrestre de Ibarra",
          "Calderón, Ecuador",
          "Tabacundo, Ecuador",
          "Cayambe, Ecuador",
          "Otavalo, Ecuador"
        ])
      },
      {
        numero_ruta: 'R018',
        hora_salida: '05:30:00',
        hora_llegada: '13:30:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[4].id, // Ambato
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Ambato",
          "Sangolquí, Ecuador",
          "Machachi, Ecuador",
          "Latacunga, Ecuador",
          "Salcedo, Ecuador"
        ])
      },
      {
        numero_ruta: 'R019',
        hora_salida: '07:45:00',
        hora_llegada: '15:45:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[12].id, // Santo Domingo
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Santo Domingo",
          "Aloag, Ecuador",
          "La Maná, Ecuador",
          "Quevedo, Ecuador"
        ])
      },
      // Rutas de regreso para Velotax
      {
        numero_ruta: 'R020',
        hora_salida: '09:30:00',
        hora_llegada: '17:30:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[2].id, // Guayaquil
        terminal_destino_id: terminales[0].id, // Quitumbe
        paradas: JSON.stringify([
          "Terminal Terrestre de Guayaquil",
          "Terminal Terrestre Quitumbe",
          "Durán, Ecuador",
          "Milagro, Ecuador",
          "Babahoyo, Ecuador",
          "Quevedo, Ecuador",
          "Santo Domingo, Ecuador"
        ])
      },
      {
        numero_ruta: 'R021',
        hora_salida: '11:00:00',
        hora_llegada: '19:00:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[3].id, // Cuenca
        terminal_destino_id: terminales[0].id, // Quitumbe
        paradas: JSON.stringify([
          "Terminal Terrestre de Cuenca",
          "Terminal Terrestre Quitumbe",
          "Azogues, Ecuador",
          "Cañar, Ecuador",
          "Riobamba, Ecuador",
          "Ambato, Ecuador",
          "Latacunga, Ecuador"
        ])
      },
      {
        numero_ruta: 'R002',
        hora_salida: '14:20:00',
        hora_llegada: '22:30:00',
        cooperativa_id: cooperativasCreadas[1].id, // Panamericana
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Guayaquil",
          "Javier Gutierrez, San Marcos, Centro Histórico, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "De los Milagros, Centro Histórico, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador"
        ])
      },
      {
        numero_ruta: 'R003',
        hora_salida: '15:30:00',
        hora_llegada: '23:30:00',
        cooperativa_id: cooperativasCreadas[2].id, // Flota Imbabura
        terminal_origen_id: terminales[1].id, // Carcelén
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Carcelén",
          "Terminal Terrestre de Guayaquil",
          "Machala, Ecuador",
          "Portoviejo, Ecuador"
        ])
      },
      // Rutas Quito - Cuenca
      {
        numero_ruta: 'R004',
        hora_salida: '12:15:00',
        hora_llegada: '19:20:00',
        cooperativa_id: cooperativasCreadas[4].id, // Santa
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[3].id, // Cuenca
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Cuenca",
          "Riobamba, Ecuador",
          "Azogues, Ecuador"
        ])
      },
      {
        numero_ruta: 'R005',
        hora_salida: '10:00:00',
        hora_llegada: '17:30:00',
        cooperativa_id: cooperativasCreadas[5].id, // Esmeraldas
        terminal_origen_id: terminales[1].id, // Carcelén
        terminal_destino_id: terminales[3].id, // Cuenca
        paradas: JSON.stringify([
          "Terminal Terrestre Carcelén",
          "Terminal Terrestre de Cuenca",
          "Salcedo, Ecuador",
          "Ambato, Ecuador",
          "Guamote, Ecuador",
          "Cañar, Ecuador"
        ])
      },
      // Rutas Ambato - Otras ciudades
      {
        numero_ruta: 'R006',
        hora_salida: '07:03:00',
        hora_llegada: '15:03:00',
        cooperativa_id: cooperativasCreadas[9].id, // San Cristóbal
        terminal_origen_id: terminales[4].id, // Ambato
        terminal_destino_id: terminales[8].id, // Manta
        paradas: JSON.stringify([
          "Terminal Terrestre de Ambato",
          "Terminal Terrestre de Manta",
          "Baños, Ecuador",
          "Santo Domingo, Ecuador",
          "Portoviejo, Ecuador"
        ])
      },
      {
        numero_ruta: 'R007',
        hora_salida: '15:54:00',
        hora_llegada: '01:54:00',
        cooperativa_id: cooperativasCreadas[9].id, // San Cristóbal
        terminal_origen_id: terminales[4].id, // Ambato
        terminal_destino_id: terminales[6].id, // Loja
        paradas: JSON.stringify([
          "Terminal Terrestre de Ambato",
          "Terminal Terrestre de Loja",
          "Riobamba, Ecuador",
          "Cuenca, Ecuador",
          "Catamayo, Ecuador"
        ])
      },
      // Rutas de regreso Guayaquil - Quito
      {
        numero_ruta: 'R008',
        hora_salida: '09:00:00',
        hora_llegada: '17:00:00',
        cooperativa_id: cooperativasCreadas[8].id, // Andina
        terminal_origen_id: terminales[2].id, // Guayaquil
        terminal_destino_id: terminales[0].id, // Quitumbe
        paradas: JSON.stringify([
          "Terminal Terrestre de Guayaquil",
          "Terminal Terrestre Quitumbe",
          "Milagro, Ecuador",
          "Babahoyo, Ecuador",
          "Santo Domingo, Ecuador",
          "Aloag, Ecuador"
        ])
      },
      {
        numero_ruta: 'R009',
        hora_salida: '08:15:00',
        hora_llegada: '16:15:00',
        cooperativa_id: cooperativasCreadas[1].id, // Panamericana
        terminal_origen_id: terminales[2].id, // Guayaquil
        terminal_destino_id: terminales[1].id, // Carcelén
        paradas: JSON.stringify([
          "Terminal Terrestre de Guayaquil",
          "Terminal Terrestre Carcelén",
          "Durán, Ecuador",
          "Babahoyo, Ecuador",
          "Quevedo, Ecuador",
          "Santo Domingo, Ecuador"
        ])
      },
      // Más rutas para completar
      {
        numero_ruta: 'R010',
        hora_salida: '06:28:00',
        hora_llegada: '12:28:00',
        cooperativa_id: cooperativasCreadas[9].id, // San Cristóbal
        terminal_origen_id: terminales[6].id, // Loja
        terminal_destino_id: terminales[8].id, // Manta
        paradas: JSON.stringify([
          "Terminal Terrestre de Loja",
          "Terminal Terrestre de Manta",
          "Machala, Ecuador",
          "Guayaquil, Ecuador",
          "Portoviejo, Ecuador"
        ])
      },
      {
        numero_ruta: 'R011',
        hora_salida: '06:30:00',
        hora_llegada: '15:30:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Guayaquil",
          "Avenida Velasco Ibarra, La Tola, Itchimbia, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "De los Milagros, Centro Histórico, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "Lex & Justice, Río de Janeiro, Larrea, San Juan, Quito, Distrito Metropolitano de Quito, Pichincha, 170118, Ecuador"
        ])
      },
      {
        numero_ruta: 'R012',
        hora_salida: '08:25:00',
        hora_llegada: '21:30:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Guayaquil",
          "Avenida Velasco Ibarra, La Tola, Itchimbia, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "De los Milagros, Centro Histórico, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "Lex & Justice, Río de Janeiro, Larrea, San Juan, Quito, Distrito Metropolitano de Quito, Pichincha, 170118, Ecuador"
        ])
      },
      {
        numero_ruta: 'R013',
        hora_salida: '09:10:00',
        hora_llegada: '21:30:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Guayaquil",
          "Avenida Velasco Ibarra, La Tola, Itchimbia, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "De los Milagros, Centro Histórico, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "Lex & Justice, Río de Janeiro, Larrea, San Juan, Quito, Distrito Metropolitano de Quito, Pichincha, 170118, Ecuador"
        ])
      },
      {
        numero_ruta: 'R014',
        hora_salida: '10:05:00',
        hora_llegada: '22:30:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Guayaquil",
          "Avenida Velasco Ibarra, La Tola, Itchimbia, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "De los Milagros, Centro Histórico, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "Lex & Justice, Río de Janeiro, Larrea, San Juan, Quito, Distrito Metropolitano de Quito, Pichincha, 170118, Ecuador"
        ])
      },
      {
        numero_ruta: 'R015',
        hora_salida: '11:45:00',
        hora_llegada: '23:30:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Guayaquil",
          "Avenida Velasco Ibarra, La Tola, Itchimbia, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "De los Milagros, Centro Histórico, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "Lex & Justice, Río de Janeiro, Larrea, San Juan, Quito, Distrito Metropolitano de Quito, Pichincha, 170118, Ecuador"
        ])
      },
      {
        numero_ruta: 'R016',
        hora_salida: '12:21:00',
        hora_llegada: '21:48:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Guayaquil",
          "Avenida Velasco Ibarra, La Tola, Itchimbia, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "De los Milagros, Centro Histórico, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "Lex & Justice, Río de Janeiro, Larrea, San Juan, Quito, Distrito Metropolitano de Quito, Pichincha, 170118, Ecuador"
        ])
      },
      {
        numero_ruta: 'R017',
        hora_salida: '14:25:00',
        hora_llegada: '23:30:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Guayaquil",
          "Avenida Velasco Ibarra, La Tola, Itchimbia, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "De los Milagros, Centro Histórico, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "Lex & Justice, Río de Janeiro, Larrea, San Juan, Quito, Distrito Metropolitano de Quito, Pichincha, 170118, Ecuador"
        ])
      },
      {
        numero_ruta: 'R018',
        hora_salida: '15:25:00',
        hora_llegada: '23:25:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Guayaquil",
          "Avenida Velasco Ibarra, La Tola, Itchimbia, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "De los Milagros, Centro Histórico, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "Lex & Justice, Río de Janeiro, Larrea, San Juan, Quito, Distrito Metropolitano de Quito, Pichincha, 170118, Ecuador"
        ])
      },
      {
        numero_ruta: 'R019',
        hora_salida: '16:05:00',
        hora_llegada: '23:30:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Guayaquil",
          "Avenida Velasco Ibarra, La Tola, Itchimbia, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "De los Milagros, Centro Histórico, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "Lex & Justice, Río de Janeiro, Larrea, San Juan, Quito, Distrito Metropolitano de Quito, Pichincha, 170118, Ecuador"
        ])
      },
      {
        numero_ruta: 'R020',
        hora_salida: '17:25:00',
        hora_llegada: '00:30:00',
        cooperativa_id: cooperativasCreadas[0].id, // Velotax
        terminal_origen_id: terminales[0].id, // Quitumbe
        terminal_destino_id: terminales[2].id, // Guayaquil
        paradas: JSON.stringify([
          "Terminal Terrestre Quitumbe",
          "Terminal Terrestre de Guayaquil",
          "Avenida Velasco Ibarra, La Tola, Itchimbia, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "De los Milagros, Centro Histórico, Quito, Distrito Metropolitano de Quito, Pichincha, 170114, Ecuador",
          "Lex & Justice, Río de Janeiro, Larrea, San Juan, Quito, Distrito Metropolitano de Quito, Pichincha, 170118, Ecuador"
        ])
      }
    ], { returning: true });

    // 10. Crear Viajes (expandido con más variedad de fechas y precios)
    console.log('✈️ Creando viajes...');
    const hoy = new Date();
    const viajes = [];

    // Función para generar fechas futuras
    const generarFechaFutura = (diasAdelante) => {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + diasAdelante);
      return fecha;
    };

    // Función para crear fecha y hora válida
    const crearFechaHora = (fecha, hora) => {
      const fechaStr = fecha.toISOString().split('T')[0]; // YYYY-MM-DD
      return new Date(`${fechaStr}T${hora}`);
    };

    // Función para crear fecha de llegada (puede ser al día siguiente)
    const crearFechaLlegada = (fechaSalida, horaSalida, horaLlegada) => {
      const fechaStr = fechaSalida.toISOString().split('T')[0];
      const fechaLlegada = new Date(`${fechaStr}T${horaLlegada}`);
      const salida = new Date(`${fechaStr}T${horaSalida}`);
      if (fechaLlegada < salida) {
        fechaLlegada.setDate(fechaLlegada.getDate() + 1);
      }
      return fechaLlegada;
    };

    // Horarios para los 12 viajes diarios Quito(Quitumbe) - Guayaquil
    const horariosQuitoGuayaquil = [
      { salida: '05:00:00', llegada: '13:00:00', precio: 12.25 },
      { salida: '18:00:00', llegada: '02:00:00', precio: 15.25 },
      { salida: '06:00:00', llegada: '14:00:00', precio: 12.50 },
      { salida: '07:00:00', llegada: '15:00:00', precio: 13.00 },
      { salida: '08:00:00', llegada: '16:00:00', precio: 13.25 },
      { salida: '09:00:00', llegada: '17:00:00', precio: 13.50 },
      { salida: '10:00:00', llegada: '18:00:00', precio: 13.75 },
      { salida: '11:00:00', llegada: '19:00:00', precio: 14.00 },
      { salida: '12:00:00', llegada: '20:00:00', precio: 14.25 },
      { salida: '13:30:00', llegada: '21:30:00', precio: 14.50 },
      { salida: '15:00:00', llegada: '23:00:00', precio: 14.75 },
      { salida: '16:30:00', llegada: '00:30:00', precio: 15.00 }
      
    ];

    // Día específico para los 12 viajes (ejemplo: hoy)
    const fechaViaje = new Date(); // hoy

    const viajesExtra = [
      { salida: '06:15:00', llegada: '14:15:00', precio: 12.60, asientos: 5, unidad: unidades[1].id },
      { salida: '05:10:00', llegada: '13:10:00', precio: 12.35, asientos: 2, unidad: unidades[0].id },
      { salida: '07:20:00', llegada: '15:20:00', precio: 13.10, asientos: 8, unidad: unidades[2].id },
      { salida: '08:25:00', llegada: '16:25:00', precio: 13.35, asientos: 12, unidad: unidades[3].id },
      { salida: '09:30:00', llegada: '17:30:00', precio: 13.60, asientos: 15, unidad: unidades[4].id },
      { salida: '10:35:00', llegada: '18:35:00', precio: 13.85, asientos: 18, unidad: unidades[5].id },
      { salida: '11:40:00', llegada: '19:40:00', precio: 14.10, asientos: 21, unidad: unidades[6].id },
      { salida: '12:45:00', llegada: '20:45:00', precio: 14.35, asientos: 24, unidad: unidades[7].id },
      { salida: '13:50:00', llegada: '21:50:00', precio: 14.60, asientos: 27, unidad: unidades[8].id },
      { salida: '15:05:00', llegada: '23:05:00', precio: 14.85, asientos: 30, unidad: unidades[9].id },
      { salida: '16:40:00', llegada: '00:40:00', precio: 15.10, asientos: 33, unidad: unidades[0].id },
      { salida: '18:05:00', llegada: '02:05:00', precio: 15.35, asientos: 36, unidad: unidades[1].id }
    ];
    const rutasQuitoGuayaquilIds = [
      rutas[0].id,   // R001 (id=1)
      rutas[10]?.id, // R011 (id=11)
      rutas[11]?.id, // R012 (id=12)
      rutas[12]?.id, // R013 (id=13)
      rutas[13]?.id, // R014 (id=14)
      rutas[14]?.id, // R015 (id=15)
      rutas[15]?.id, // R016 (id=16)
      rutas[16]?.id, // R017 (id=17)
      rutas[17]?.id, // R018 (id=18)
      rutas[18]?.id, // R019 (id=19)
      rutas[19]?.id  // R020 (id=20)
    ].filter(Boolean); // Por si alguna no existe


    for (const v of viajesExtra) {
      viajes.push({
        fecha_salida: crearFechaHora(fechaViaje, v.salida),
        fecha_llegada: crearFechaLlegada(fechaViaje, v.salida, v.llegada),
        numero_asientos_ocupados: v.asientos,
        precio: v.precio,
        ruta_id: rutas[0].id, // Quito(Quitumbe) - Guayaquil
        unidad_id: v.unidad
      });
    }

    // Generar viajes para los próximos 4 días, incluyendo hoy (dia = 0)
    for (let dia = 0; dia < 4; dia++) {
      const fechaViaje = generarFechaFutura(dia); // dia=0 es hoy


      for (let i = 0; i < horariosQuitoGuayaquil.length; i++) {
        const rutaIdx = i % rutasQuitoGuayaquilIds.length;
        viajes.push({
          fecha_salida: crearFechaHora(fechaViaje, horariosQuitoGuayaquil[i].salida),
          fecha_llegada: crearFechaLlegada(fechaViaje, horariosQuitoGuayaquil[i].salida, horariosQuitoGuayaquil[i].llegada),
          numero_asientos_ocupados: 0,
          precio: horariosQuitoGuayaquil[i].precio,
          ruta_id: rutasQuitoGuayaquilIds[rutaIdx], // alterna entre rutas 1, 11, ..., 20
          unidad_id: unidades[i % unidades.length].id // alterna unidades
        });
      }

      // Para el resto de rutas (rutas[1] en adelante), crea 1 viaje diario por ruta
      for (let r = 1; r < rutas.length; r++) {
        // Puedes variar la hora y el precio si lo deseas, aquí se usa una hora base y alterna unidad
        const horaSalida = '08:00:00';
        const horaLlegada = '16:00:00';
        const precioBase = 10 + r; // solo para variar el precio
        viajes.push({
          fecha_salida: crearFechaHora(fechaViaje, horaSalida),
          fecha_llegada: crearFechaLlegada(fechaViaje, horaSalida, horaLlegada),
          numero_asientos_ocupados: 0,
          precio: precioBase,
          ruta_id: rutas[r].id,
          unidad_id: unidades[(r + dia) % unidades.length].id // alterna unidad por ruta y día
        });
      }
    }

    console.log(`📊 Total de viajes a crear: ${viajes.length}`);

    // Verificar que todas las fechas son válidas antes de insertar
    const viajesValidos = viajes.filter(viaje => {
      const fechaSalidaValida = viaje.fecha_salida instanceof Date && !isNaN(viaje.fecha_salida);
      const fechaLlegadaValida = viaje.fecha_llegada instanceof Date && !isNaN(viaje.fecha_llegada);
      
      if (!fechaSalidaValida || !fechaLlegadaValida) {
        console.warn('⚠️ Viaje con fecha inválida omitido:', {
          fecha_salida: viaje.fecha_salida,
          fecha_llegada: viaje.fecha_llegada,
          ruta_id: viaje.ruta_id
        });
        return false;
      }
      return true;
    });

    console.log(`✅ Viajes válidos a insertar: ${viajesValidos.length}`);

    const viajesCreados = await Viaje.bulkCreate(viajesValidos, { returning: true });

    // 10.5. Crear registros ViajeAsiento para simular asientos ocupados
    console.log('💺 Creando asientos ocupados para viajes...');
    
    const viajeAsientosCreados = [];
    
    // Función para generar asientos ocupados aleatorios para un viaje
    const generarAsientosOcupados = (maxAsientos = 15) => {
      const numAsientosOcupados = Math.floor(Math.random() * maxAsientos);
      const asientosOcupados = new Set();
      
      while (asientosOcupados.size < numAsientosOcupados) {
        const asientoRandom = Math.floor(Math.random() * 44) + 1; // Asientos del 1 al 44
        asientosOcupados.add(asientoRandom);
      }
      
      return Array.from(asientosOcupados);
    };
    
    // Para cada viaje creado, generar algunos asientos ocupados
    for (const viaje of viajesCreados) {
      const asientosOcupados = generarAsientosOcupados(15); // Máximo 15 asientos ocupados
      
      // Crear registros ViajeAsiento
      for (const asientoId of asientosOcupados) {
        viajeAsientosCreados.push({
          viaje_id: viaje.id,
          asiento_id: asientoId
        });
      }
      
      // Actualizar el numero_asientos_ocupados del viaje
      await viaje.update({
        numero_asientos_ocupados: asientosOcupados.length
      });
    }
    
    // Crear todos los registros ViajeAsiento
    if (viajeAsientosCreados.length > 0) {
      await ViajeAsiento.bulkCreate(viajeAsientosCreados);
      console.log(`✅ ${viajeAsientosCreados.length} asientos ocupados creados`);
    }

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
      },
      {
        nombres: 'Carlos Eduardo',
        apellidos: 'Morales Vásquez',
        fecha_nacimiento: '1988-11-15',
        cedula: '0987654324'
      },
      {
        nombres: 'María Elena',
        apellidos: 'Rodríguez Castro',
        fecha_nacimiento: '1993-02-28',
        cedula: '0987654325'
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
        viaje_id: viajesCreados[0].id
      },
      {
        fecha: new Date(),
        email_contacto: 'jose.martinez@email.com',
        telefono_contacto: '0987654322',
        pasajero_id: pasajeros[1].id,
        viaje_id: viajesCreados[1].id
      },
      {
        fecha: new Date(),
        email_contacto: 'laura.hernandez@email.com',
        telefono_contacto: '0987654323',
        pasajero_id: pasajeros[2].id,
        viaje_id: viajesCreados[5].id
      }
    ], { returning: true });

    // 13. Crear boletos para las compras
    console.log('🎫 Creando boletos...');

    // Función para generar un código de boleto aleatorio tipo BOL-XXXXXX-XXXXXX
    function generarCodigoBoleto() {
      const parte1 = Math.floor(100000 + Math.random() * 900000); // 6 dígitos
      const parte2 = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 letras/números
      return `BOL-${parte1}-${parte2}`;
    }

    // Función para obtener un asiento aleatorio (del 1 al 44 como integer)
    function asientoAleatorio() {
      return Math.floor(Math.random() * 44) + 1;
    }

    await Boleto.bulkCreate([
      {
        codigo: generarCodigoBoleto(),
        valor: viajesCreados[0].precio,
        compra_id: compras[0].id,
        pasajero_id: pasajeros[0].id,
        asiento_id: asientoAleatorio()
      },
      {
        codigo: generarCodigoBoleto(),
        valor: viajesCreados[1].precio,
        compra_id: compras[1].id,
        pasajero_id: pasajeros[1].id,
        asiento_id: asientoAleatorio()
      },
      {
        codigo: generarCodigoBoleto(),
        valor: viajesCreados[5].precio,
        compra_id: compras[2].id,
        pasajero_id: pasajeros[2].id,
        asiento_id: asientoAleatorio()
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
    console.log(`   ✈️ Viajes: ${viajesCreados.length}`);
    console.log(`   🎯 Asientos ocupados: ${viajeAsientosCreados.length}`);
    console.log(`   👥 Pasajeros: ${pasajeros.length}`);
    console.log(`   🛒 Compras: ${compras.length}`);
    console.log(`   🎫 Boletos: 3`);

    // Mostrar estadísticas de asientos ocupados
    const asientosOcupadosPorViaje = viajesCreados.map(v => v.numero_asientos_ocupados);
    const totalAsientosOcupados = asientosOcupadosPorViaje.reduce((a, b) => a + b, 0);
    const promedioAsientosOcupados = totalAsientosOcupados / viajesCreados.length;

    console.log('\n🎯 ESTADÍSTICAS DE ASIENTOS:');
    console.log(`   💺 Total asientos disponibles por viaje: 44`);
    console.log(`   🎯 Total asientos ocupados: ${totalAsientosOcupados}`);
    console.log(`   📊 Promedio asientos ocupados por viaje: ${promedioAsientosOcupados.toFixed(1)}`);

    // Mostrar estadísticas de precios
    const precios = viajesCreados.map(v => parseFloat(v.precio));
    const precioMinimo = Math.min(...precios);
    const precioMaximo = Math.max(...precios);
    const precioPromedio = precios.reduce((a, b) => a + b, 0) / precios.length;

    console.log('\n💰 ESTADÍSTICAS DE PRECIOS:');
    console.log(`   💵 Precio mínimo: $${precioMinimo.toFixed(2)}`);
    console.log(`   💲 Precio máximo: $${precioMaximo.toFixed(2)}`);
    console.log(`   📊 Precio promedio: $${precioPromedio.toFixed(2)}`);

    console.log('\n🔐 CREDENCIALES DE ACCESO:');
    console.log('   Super Usuario:');
    console.log('     📧 Email: admin@transportesec.com');
    console.log('     🔑 Contraseña: admin2024');
    console.log('\n   Usuario Final (ejemplo):');
    console.log('     📧 Email: juan.perez@email.com');
    console.log('     🔑 Contraseña: usuario123');
    console.log('\n   Cooperativa Velotax:');
    console.log('     📧 Email: admin@velotax.com');
    console.log('     🔑 Contraseña: coop123');
    console.log('\n   Cooperativa Panamericana:');
    console.log('     📧 Email: gerencia@panamericana.com');
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
    console.log('🔍 El precio mínimo será consultado dinámicamente desde la DB');
    
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
