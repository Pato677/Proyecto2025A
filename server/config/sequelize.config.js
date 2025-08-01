const {Sequelize} = require("sequelize");

const username = "root";
const password = "admin";
//const password = "root";
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
});

//EN el sync si se utiliza el parametro de entrafa force: true, se eliminan las tablas existentes y se crean de nuevo
//Con el alter:true se actualizan las tablas existentes sin perder los datos, pero puede causar problemas si hay cambios incompatibles (Hace el mejor intento de mantener los datos)
//Lo recomendable en el desarrollo es usar force true
//En producción no se debe utilizar ninguno.

sequelize.sync({force:true}).then(async () => {
//sequelize.sync().then(() => {
//sequelize.sync({ alter: true }).then(async () => {
    console.log(`Base de datos ${bdd_name} sincronizada`);
    
    // 🎯 CARGAR DATOS DE PRUEBA AUTOMÁTICAMENTE CUANDO SE USA force:true
    // Como force:true elimina y recrea las tablas, siempre cargamos datos frescos
    const isForceSync = true; // Cambiar a false cuando uses sync() o sync({ alter: true })
    
    if (isForceSync) {
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
    
    // ✅ CARGAR modelos DESPUÉS del sync
    //const migrateData = require('../models/migrateData');
    //await migrateData();
}).catch((error) => {
    console.error(`Error al sincronizar la base de datos ${bdd_name}`, error);
});

module.exports = sequelize;
