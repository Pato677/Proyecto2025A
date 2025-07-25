// scripts/setup-database.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root', // Cambia según tu configuración
    password: '', // Cambia según tu configuración
    multipleStatements: true
};

async function setupDatabase() {
    let connection;
    
    try {
        console.log('🔄 Conectando a MySQL...');
        connection = await mysql.createConnection(dbConfig);
        
        console.log('✅ Conectado a MySQL');
        
        // Leer el archivo SQL
        const sqlPath = path.join(__dirname, '..', 'database_estructura_v2.sql');
        const sqlScript = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('🔄 Ejecutando script de base de datos...');
        
        // Ejecutar el script SQL
        await connection.execute(sqlScript);
        
        console.log('✅ Base de datos configurada correctamente');
        console.log('📊 Estructura de tablas creada');
        console.log('🔐 Usuarios superusuario creados:');
        console.log('   - admin@sistema.com');
        console.log('   - superadmin@sistema.com');
        console.log('   - soporte@sistema.com');
        console.log('🏢 Datos de ejemplo insertados');
        console.log('🔧 Procedimientos almacenados configurados');
        
    } catch (error) {
        console.error('❌ Error al configurar la base de datos:', error);
        console.error('Detalles:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexión cerrada');
        }
    }
}

// Función para verificar las tablas creadas
async function verifyTables() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            ...dbConfig,
            database: 'sistema_transporte'
        });
        
        console.log('\n🔍 Verificando tablas creadas...');
        
        const [tables] = await connection.execute('SHOW TABLES');
        
        console.log('📋 Tablas en la base de datos:');
        tables.forEach(table => {
            const tableName = table[`Tables_in_sistema_transporte`];
            console.log(`   ✓ ${tableName}`);
        });
        
        // Verificar datos de ejemplo
        console.log('\n👥 Verificando usuarios creados...');
        const [usuarios] = await connection.execute('SELECT email, rol FROM usuarios');
        
        usuarios.forEach(usuario => {
            console.log(`   ✓ ${usuario.email} (${usuario.rol})`);
        });
        
        console.log('\n🏙️ Verificando ciudades y terminales...');
        const [ciudadesTerminales] = await connection.execute(`
            SELECT c.nombre as ciudad, COUNT(t.id) as terminales 
            FROM ciudades c 
            LEFT JOIN terminales t ON c.id = t.ciudadId 
            GROUP BY c.id, c.nombre
        `);
        
        ciudadesTerminales.forEach(item => {
            console.log(`   ✓ ${item.ciudad}: ${item.terminales} terminales`);
        });
        
    } catch (error) {
        console.error('❌ Error al verificar tablas:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar setup
async function main() {
    console.log('🚀 CONFIGURACIÓN DE BASE DE DATOS - SISTEMA DE TRANSPORTE');
    console.log('================================================\n');
    
    await setupDatabase();
    await verifyTables();
    
    console.log('\n🎉 ¡Configuración completada!');
    console.log('💡 Ahora puedes iniciar tu servidor Node.js');
    console.log('🔗 Endpoints disponibles:');
    console.log('   - POST /auth/login - Login universal');
    console.log('   - POST /auth/registro/usuario - Registro de usuario');
    console.log('   - POST /auth/registro/cooperativa - Registro de cooperativa');
    console.log('   - GET /ciudades-terminales/plano - Datos para tabla');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { setupDatabase, verifyTables };
