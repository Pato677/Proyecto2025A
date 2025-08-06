require('dotenv').config();
const { Sequelize } = require("sequelize");

const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const bdd_name = "transportesec";
const hostName = "localhost";

// Conexión inicial sin especificar la base de datos
const initialSequelize = new Sequelize(`mysql://${username}:${password}@localhost`);

initialSequelize.query(`CREATE DATABASE IF NOT EXISTS ${bdd_name};`)
    .then(() => console.log("DBB creada o ya existía"))
    .catch((error) => {
        console.error("Error al crear la BDD", error);
        process.exit(1);
    });

const sequelize = new Sequelize(bdd_name, username, password, {
    host: hostName,
    dialect: "mysql",
    // Configuración para manejar foreign keys correctamente
    dialectOptions: {
        multipleStatements: true
    },
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci'
    }
});

// Función para recrear la base de datos correctamente
const recreateDatabase = async () => {
    try {
        console.log('🔄 Iniciando recreación de base de datos...');
        
        // Desactivar foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        console.log('✅ Foreign key checks desactivados');
        
        // Intentar hacer sync con force: true
        await sequelize.sync({ force: true });
        console.log('✅ Tablas recreadas exitosamente');
        
        // Reactivar foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ Foreign key checks reactivados');
        
        return true;
    } catch (error) {
        console.error('❌ Error durante recreación de BD:', error.message);
        // Intentar reactivar foreign key checks aunque haya error
        try {
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        } catch (e) {
            console.error('❌ Error reactivando foreign keys:', e.message);
        }
        return false;
    }
};

// Función para sincronizar la base de datos
const initializeDatabase = async () => {
    try {
        // 🔥 ACTIVAR PARA RECARGAR DATOS AUTOMÁTICAMENTE 
        const forceRecreate = true; // Cambiar a false cuando no quieras recrear
        
        if (forceRecreate) {
            console.log('🚀 RECREANDO BASE DE DATOS CON DATOS FRESCOS...');
            const success = await recreateDatabase();
            
            if (!success) {
                console.log('❌ Error en recreación, intentando sync normal...');
                await sequelize.sync();
            }
        } else {
            await sequelize.sync();
            //await sequelize.sync({ alter: true });
        }
        
        console.log(`Base de datos ${bdd_name} sincronizada`);
        
        // 🎯 CARGAR DATOS DE PRUEBA AUTOMÁTICAMENTE CUANDO SE USA force:true
        if (forceRecreate) {
            console.log('🚀 CARGANDO DATOS DE PRUEBA - Base de datos recreada...');
            
            try {
                // Importar y ejecutar el script de carga de datos
                const { cargarDatosPrueba } = require('../database/data/load_test_data');
                await cargarDatosPrueba();
                
                console.log('✅ Datos de prueba cargados correctamente');
                console.log('💡 Los datos se cargan automáticamente cada vez que se reinicia con force:true');
            } catch (error) {
                console.error('❌ Error al cargar datos de prueba:', error);
            }
        } else {
            console.log('ℹ️ Sync sin force - No se cargan datos de prueba automáticamente');
        }
        
    } catch (error) {
        console.error(`Error al sincronizar la base de datos ${bdd_name}`, error);
    }
};

// Ejecutar la inicialización
initializeDatabase();

module.exports = sequelize;
