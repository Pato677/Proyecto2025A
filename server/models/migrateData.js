const fs = require('fs');
const path = require('path');
const { 
    Usuario, UsuarioFinal, UsuarioCooperativa, Ciudad, Terminal, 
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
                // Crear usuario principal
                const [usuario, created] = await Usuario.findOrCreate({
                    where: { email: user.correo },
                    defaults: {
                        email: user.correo,
                        password: user.contrasena,
                        telefono: user.telefono,
                        rol: 'usuario'
                    }
                });

                // Crear perfil de usuario final
                if (created) {
                    await UsuarioFinal.create({
                        usuario_id: usuario.id,
                        nombres: user.nombres,
                        apellidos: user.apellidos,
                        cedula: user.cedula,
                        fecha_nacimiento: user.fechaNacimiento
                    });
                }
            }
        }

        // 2. Migrar Cooperativas (agregar datos dummy si no existen)
        console.log('🏢 Migrando cooperativas...');
        const cooperativasDefault = [
            {
                email: "admin@velotax.com",
                password: "admin123",
                telefono: "022345678",
                rol: "cooperativa",
                nombre_cooperativa: "Cooperativa Velotax",
                ruc: "1234567890001",
                razon_social: "Cooperativa de Transporte Velotax Cia. Ltda.",
                representante_legal: "Juan Pérez González",
                cedula_representante: "1700000001",
                direccion_matriz: "Av. Principal 123, Quito",
                ciudad_matriz: "Quito"
            },
            {
                email: "admin@panamericana.com",
                password: "admin123", 
                telefono: "022345679",
                rol: "cooperativa",
                nombre_cooperativa: "Cooperativa Panamericana",
                ruc: "1234567890002",
                razon_social: "Cooperativa de Transporte Panamericana S.A.",
                representante_legal: "María López Castro",
                cedula_representante: "1700000002",
                direccion_matriz: "Calle Secundaria 456, Guayaquil",
                ciudad_matriz: "Guayaquil"
            }
        ];

        for (const coop of cooperativasDefault) {
            // Crear usuario principal
            const [usuario, created] = await Usuario.findOrCreate({
                where: { email: coop.email },
                defaults: {
                    email: coop.email,
                    password: coop.password,
                    telefono: coop.telefono,
                    rol: coop.rol
                }
            });

            // Crear perfil de cooperativa
            if (created) {
                await UsuarioCooperativa.create({
                    usuario_id: usuario.id,
                    nombre_cooperativa: coop.nombre_cooperativa,
                    ruc: coop.ruc,
                    razon_social: coop.razon_social,
                    representante_legal: coop.representante_legal,
                    cedula_representante: coop.cedula_representante,
                    direccion_matriz: coop.direccion_matriz,
                    ciudad_matriz: coop.ciudad_matriz
                });
            }
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
                            ciudad_id: ciudad.id 
                        },
                        defaults: {
                            nombre: terminalNombre,
                            ciudad_id: ciudad.id
                        }
                    });
                }
            }
        }

        // 4. Migrar Conductores
        console.log('👨‍✈️ Migrando conductores...');
        if (jsonData.conductores && jsonData.conductores.length > 0) {
            // Obtener la primera cooperativa para asignar a los conductores
            const cooperativa = await UsuarioCooperativa.findOne();
            
            for (const conductor of jsonData.conductores) {
                await Conductor.findOrCreate({
                    where: { identificacion: conductor.identificacion },
                    defaults: {
                        nombre: conductor.nombre,
                        identificacion: conductor.identificacion,
                        tipo_licencia: conductor.tipoLicencia,
                        telefono: conductor.telefono,
                        correo: conductor.correo,
                        roles: conductor.roles,
                        cooperativa_id: cooperativa?.id,
                        estado: 'activo'
                    }
                });
            }
        }

        // 5. Migrar Unidades
        console.log('🚌 Migrando unidades...');
        if (jsonData.unidades && jsonData.unidades.length > 0) {
            // Obtener la primera cooperativa para asignar a las unidades
            const cooperativa = await UsuarioCooperativa.findOne();
            
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
                        numero_unidad: unidad.numeroUnidad,
                        pisos: unidad.pisos,
                        asientos: unidad.asientos,
                        imagen: unidad.imagen,
                        cooperativa_id: cooperativa?.id,
                        conductor_id: conductor?.id,
                        controlador_id: controlador?.id,
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