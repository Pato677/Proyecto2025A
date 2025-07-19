const fs = require('fs');
const path = require('path');
const { 
    Usuario, Cooperativa, Ciudad, Terminal, 
    Conductor, Unidad, Ruta, Viaje 
} = require('../models');

async function migrateData() {
    try {
        // Leer datos del JSON
        const jsonData = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8')
        );

        console.log('🚀 Iniciando migración de datos...');

        // 1. Migrar Usuarios
        console.log('📄 Migrando usuarios...');
        for (const user of jsonData.UsuarioPasajero) {
            await Usuario.findOrCreate({
                where: { id: user.id },
                defaults: {
                    nombres: user.nombres,
                    apellidos: user.apellidos,
                    fechaNacimiento: user.fechaNacimiento,
                    cedula: user.cedula,
                    correo: user.correo,
                    telefono: user.telefono,
                    contrasena: user.contrasena
                }
            });
        }

        // 2. Migrar Cooperativas
        console.log('🏢 Migrando cooperativas...');
        for (const coop of jsonData.Cooperativas) {
            await Cooperativa.findOrCreate({
                where: { id: coop.id },
                defaults: {
                    razonSocial: coop.razonSocial,
                    permisoOperacion: coop.permisoOperacion,
                    ruc: coop.ruc,
                    correo: coop.correo,
                    telefono: coop.telefono,
                    contrasena: coop.contrasena,
                    estado: 'activa'
                }
            });
        }

        // 3. Migrar Ciudades y Terminales
        console.log('🏙️ Migrando ciudades y terminales...');
        for (const terminal of jsonData.TerminalesInterprovinciales) {
            const [ciudad] = await Ciudad.findOrCreate({
                where: { nombre: terminal.ciudad },
                defaults: { nombre: terminal.ciudad }
            });

            for (const terminalNombre of terminal.terminales) {
                await Terminal.findOrCreate({
                    where: { 
                        nombre: terminalNombre,
                        ciudadId: ciudad.id 
                    },
                    defaults: {
                        nombre: terminalNombre,
                        ciudadId: ciudad.id
                    }
                });
            }
        }

        // 4. Migrar Conductores (basado en unidades)
        console.log('👨‍✈️ Migrando conductores...');
        const conductoresSet = new Set();
        const controladoresSet = new Set();

        jsonData.unidades.forEach(unidad => {
            if (unidad.conductor) conductoresSet.add(unidad.conductor);
            if (unidad.controlador) controladoresSet.add(unidad.controlador);
        });

        const allPersonal = [...new Set([...conductoresSet, ...controladoresSet])];
        
        for (let i = 0; i < allPersonal.length; i++) {
            const persona = allPersonal[i];
            const esConductor = conductoresSet.has(persona);
            const esControlador = controladoresSet.has(persona);
            
            const roles = [];
            if (esConductor) roles.push('conductor');
            if (esControlador) roles.push('controlador');

            await Conductor.findOrCreate({
                where: { nombre: persona },
                defaults: {
                    nombre: persona,
                    identificacion: `170000000${i}`.slice(-10),
                    tipoLicencia: esConductor ? 'D (Pasajeros)' : 'N/A',
                    telefono: `099${String(i).padStart(7, '0')}`,
                    correo: `${persona.toLowerCase().replace(/\s+/g, '.')}@transport.ec`,
                    roles: roles,
                    estado: 'activo'
                }
            });
        }

        // 5. Migrar Unidades
        console.log('🚌 Migrando unidades...');
        for (const unidad of jsonData.unidades) {
            const conductor = await Conductor.findOne({ 
                where: { nombre: unidad.conductor } 
            });
            const controlador = await Conductor.findOne({ 
                where: { nombre: unidad.controlador } 
            });

            await Unidad.findOrCreate({
                where: { placa: unidad.placa },
                defaults: {
                    placa: unidad.placa,
                    numeroUnidad: unidad.numeroUnidad,
                    pisos: unidad.pisos,
                    asientos: unidad.asientos,
                    imagen: unidad.imagen,
                    conductorId: conductor?.id,
                    controladorId: controlador?.id,
                    estado: 'activa'
                }
            });
        }

        console.log('✅ Migración completada exitosamente!');

    } catch (error) {
        console.error('❌ Error durante la migración:', error);
    }
}

module.exports = migrateData;