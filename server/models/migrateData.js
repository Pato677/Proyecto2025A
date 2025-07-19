const fs = require('fs');
const path = require('path');
const { 
    Usuario, Cooperativa, Ciudad, Terminal, 
    Conductor, Unidad, Ruta, Viaje 
} = require('./index');

async function migrateData() {
    try {
        // Leer datos del JSON desde client
        const jsonData = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../../client/db.json'), 'utf8')
        );

        console.log('🚀 Iniciando migración de datos...');

        // 1. Migrar Usuarios
        console.log('📄 Migrando usuarios...');
        if (jsonData.UsuarioPasajero && jsonData.UsuarioPasajero.length > 0) {
            for (const user of jsonData.UsuarioPasajero) {
                await Usuario.findOrCreate({
                    where: { cedula: user.cedula }, // CAMBIO: Buscar por cedula en lugar de ID
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
        }

        // 2. Migrar Cooperativas (agregar datos dummy si no existen)
        console.log('🏢 Migrando cooperativas...');
        const cooperativasDefault = [
            {
                razonSocial: "Cooperativa Velotax",
                permisoOperacion: "POP-001",
                ruc: "1234567890001",
                correo: "admin@velotax.com",
                telefono: "022345678",
                contrasena: "admin123",
                estado: "activa"
            },
            {
                razonSocial: "Cooperativa Panamericana",
                permisoOperacion: "POP-002", 
                ruc: "1234567890002",
                correo: "admin@panamericana.com",
                telefono: "022345679",
                contrasena: "admin123",
                estado: "activa"
            }
        ];

        for (const coop of cooperativasDefault) {
            await Cooperativa.findOrCreate({
                where: { ruc: coop.ruc },
                defaults: coop
            });
        }

        // 3. Migrar Ciudades y Terminales
        console.log('🏙️ Migrando ciudades y terminales...');
        if (jsonData.TerminalesInterprovinciales && jsonData.TerminalesInterprovinciales.length > 0) {
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
        }

        // 4. Migrar Conductores
        console.log('👨‍✈️ Migrando conductores...');
        if (jsonData.conductores && jsonData.conductores.length > 0) {
            for (const conductor of jsonData.conductores) {
                await Conductor.findOrCreate({
                    where: { identificacion: conductor.identificacion },
                    defaults: {
                        nombre: conductor.nombre,
                        identificacion: conductor.identificacion,
                        tipoLicencia: conductor.tipoLicencia,
                        telefono: conductor.telefono,
                        correo: conductor.correo,
                        roles: conductor.roles,
                        estado: 'activo'
                    }
                });
            }
        }

        // 5. Migrar Unidades
        console.log('🚌 Migrando unidades...');
        if (jsonData.unidades && jsonData.unidades.length > 0) {
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
        }

        console.log('✅ Migración completada exitosamente!');

    } catch (error) {
        console.error('❌ Error durante la migración:', error);
    }
}

module.exports = migrateData;