const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('transportesec', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

async function checkColumns() {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida con la base de datos.');
    
    const [results] = await sequelize.query('DESCRIBE usuarios_finales');
    console.log('\nColumnas en usuarios_finales:');
    results.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

checkColumns();
