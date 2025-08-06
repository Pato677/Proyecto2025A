require('dotenv').config();
const { Sequelize } = require("sequelize");

const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const bdd_name = "transportesec";
const hostName = "localhost";


// Exporta la instancia para los modelos
const sequelize = new Sequelize(bdd_name, username, password, {
    host: hostName,
    dialect: "mysql",
    dialectOptions: {
        multipleStatements: true
    },
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci'
    }
});

module.exports = sequelize;