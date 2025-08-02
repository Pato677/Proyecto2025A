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
    for (let i = 1; i <= 60; i++) { // Aumentado para buses de 2 pisos
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

    // 9. Crear Rutas (expandido con más rutas basadas en db.json)
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
          { nombre: 'Machachi', hora: '14:30' },
          { nombre: 'Latacunga', hora: '15:30' },
          { nombre: 'La Maná', hora: '17:00' },
          { nombre: 'Babahoyo', hora: '19:00' }
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
          { nombre: 'Latacunga', hora: '15:30' },
          { nombre: 'Ambato', hora: '16:30' },
          { nombre: 'Babahoyo', hora: '20:00' }
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
          { nombre: 'Machachi', hora: '16:30' },
          { nombre: 'Latacunga', hora: '17:30' },
          { nombre: 'La Maná', hora: '19:00' },
          { nombre: 'Milagro', hora: '22:00' }
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
          { nombre: 'Latacunga', hora: '13:30' },
          { nombre: 'Ambato', hora: '14:30' },
          { nombre: 'Riobamba', hora: '15:30' },
          { nombre: 'Azogues', hora: '18:30' }
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
          { nombre: 'Salcedo', hora: '11:00' },
          { nombre: 'Ambato', hora: '12:00' },
          { nombre: 'Guamote', hora: '14:00' },
          { nombre: 'Cañar', hora: '16:00' }
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
          { nombre: 'Baños', hora: '08:00' },
          { nombre: 'Santo Domingo', hora: '11:00' },
          { nombre: 'Portoviejo', hora: '13:30' }
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
          { nombre: 'Riobamba', hora: '17:00' },
          { nombre: 'Cuenca', hora: '21:00' },
          { nombre: 'Catamayo', hora: '01:00' }
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
          { nombre: 'Milagro', hora: '10:00' },
          { nombre: 'Babahoyo', hora: '11:00' },
          { nombre: 'Santo Domingo', hora: '13:00' },
          { nombre: 'Aloag', hora: '15:30' }
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
          { nombre: 'Durán', hora: '08:30' },
          { nombre: 'Babahoyo', hora: '10:00' },
          { nombre: 'Quevedo', hora: '11:30' },
          { nombre: 'Santo Domingo', hora: '13:00' }
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
          { nombre: 'Machala', hora: '08:00' },
          { nombre: 'Guayaquil', hora: '10:00' },
          { nombre: 'Portoviejo', hora: '11:30' }
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
      
      // Si la hora de llegada es menor que la de salida, es al día siguiente
      const salida = new Date(`${fechaStr}T${horaSalida}`);
      if (fechaLlegada < salida) {
        fechaLlegada.setDate(fechaLlegada.getDate() + 1);
      }
      
      return fechaLlegada;
    };

    // Generar viajes para los próximos 7 días
    for (let dia = 1; dia <= 7; dia++) {
      const fechaViaje = generarFechaFutura(dia);
      
      // Viajes Quito-Guayaquil (múltiples horarios)
      viajes.push(
        {
          fecha_salida: crearFechaHora(fechaViaje, '13:30:00'),
          fecha_llegada: crearFechaLlegada(fechaViaje, '13:30:00', '21:30:00'),
          numero_asientos_ocupados: Math.floor(Math.random() * 15),
          precio: 12.25,
          ruta_id: rutas[0].id,
          unidad_id: unidades[0].id
        },
        {
          fecha_salida: crearFechaHora(fechaViaje, '14:20:00'),
          fecha_llegada: crearFechaLlegada(fechaViaje, '14:20:00', '22:30:00'),
          numero_asientos_ocupados: Math.floor(Math.random() * 20),
          precio: 14.83,
          ruta_id: rutas[1].id,
          unidad_id: unidades[1].id
        },
        {
          fecha_salida: crearFechaHora(fechaViaje, '15:30:00'),
          fecha_llegada: crearFechaLlegada(fechaViaje, '15:30:00', '23:30:00'),
          numero_asientos_ocupados: Math.floor(Math.random() * 25),
          precio: 17.85,
          ruta_id: rutas[2].id,
          unidad_id: unidades[2].id
        }
      );

      // Viajes Quito-Cuenca
      viajes.push(
        {
          fecha_salida: crearFechaHora(fechaViaje, '12:15:00'),
          fecha_llegada: crearFechaLlegada(fechaViaje, '12:15:00', '19:20:00'),
          numero_asientos_ocupados: Math.floor(Math.random() * 18),
          precio: 15.75,
          ruta_id: rutas[3].id,
          unidad_id: unidades[4].id
        },
        {
          fecha_salida: crearFechaHora(fechaViaje, '10:00:00'),
          fecha_llegada: crearFechaLlegada(fechaViaje, '10:00:00', '17:30:00'),
          numero_asientos_ocupados: Math.floor(Math.random() * 22),
          precio: 13.40,
          ruta_id: rutas[4].id,
          unidad_id: unidades[5].id
        }
      );

      // Viajes especiales (precios más variados)
      if (dia % 2 === 0) { // Solo días pares
        viajes.push(
          {
            fecha_salida: crearFechaHora(fechaViaje, '07:03:00'),
            fecha_llegada: crearFechaLlegada(fechaViaje, '07:03:00', '15:03:00'),
            numero_asientos_ocupados: Math.floor(Math.random() * 10),
            precio: 6.64, // Precio más bajo
            ruta_id: rutas[5].id,
            unidad_id: unidades[6].id
          },
          {
            fecha_salida: crearFechaHora(fechaViaje, '15:54:00'),
            fecha_llegada: crearFechaLlegada(fechaViaje, '15:54:00', '01:54:00'), // Llegada al día siguiente
            numero_asientos_ocupados: Math.floor(Math.random() * 12),
            precio: 32.00, // Precio más alto para viaje nocturno largo
            ruta_id: rutas[6].id,
            unidad_id: unidades[7].id
          }
        );
      }

      // Viajes de regreso
      viajes.push(
        {
          fecha_salida: crearFechaHora(fechaViaje, '09:00:00'),
          fecha_llegada: crearFechaLlegada(fechaViaje, '09:00:00', '17:00:00'),
          numero_asientos_ocupados: Math.floor(Math.random() * 16),
          precio: 13.00,
          ruta_id: rutas[7].id,
          unidad_id: unidades[8].id
        },
        {
          fecha_salida: crearFechaHora(fechaViaje, '08:15:00'),
          fecha_llegada: crearFechaLlegada(fechaViaje, '08:15:00', '16:15:00'),
          numero_asientos_ocupados: Math.floor(Math.random() * 19),
          precio: 16.50,
          ruta_id: rutas[8].id,
          unidad_id: unidades[9].id
        }
      );

      // Agregar más viajes variados para tener más datos
      if (dia <= 5) { // Solo los primeros 5 días para no saturar
        viajes.push(
          {
            fecha_salida: crearFechaHora(fechaViaje, '06:28:00'),
            fecha_llegada: crearFechaLlegada(fechaViaje, '06:28:00', '12:28:00'),
            numero_asientos_ocupados: Math.floor(Math.random() * 8),
            precio: 18.90,
            ruta_id: rutas[9].id,
            unidad_id: unidades[Math.floor(Math.random() * unidades.length)].id
          },
          // Viaje económico adicional
          {
            fecha_salida: crearFechaHora(fechaViaje, '11:00:00'),
            fecha_llegada: crearFechaLlegada(fechaViaje, '11:00:00', '18:30:00'),
            numero_asientos_ocupados: Math.floor(Math.random() * 12),
            precio: 5.50, // Precio aún más bajo
            ruta_id: rutas[Math.floor(Math.random() * 5)].id,
            unidad_id: unidades[Math.floor(Math.random() * unidades.length)].id
          }
        );
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
    await Boleto.bulkCreate([
      {
        codigo: `BOL-${Date.now()}-001`,
        valor: viajesCreados[0].precio,
        compra_id: compras[0].id,
        pasajero_id: pasajeros[0].id
      },
      {
        codigo: `BOL-${Date.now()}-002`,
        valor: viajesCreados[1].precio,
        compra_id: compras[1].id,
        pasajero_id: pasajeros[1].id
      },
      {
        codigo: `BOL-${Date.now()}-003`,
        valor: viajesCreados[5].precio,
        compra_id: compras[2].id,
        pasajero_id: pasajeros[2].id
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
    console.log(`   👥 Pasajeros: ${pasajeros.length}`);
    console.log(`   🛒 Compras: ${compras.length}`);
    console.log(`   🎫 Boletos: 3`);

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
