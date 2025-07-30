const sequelize = require('./config/sequelize.config');

async function addParadasColumn() {
  try {
    console.log('=== Verificando columna paradas ===');
    
    // Verificar si la columna paradas existe
    const columns = await sequelize.query('DESCRIBE rutas', { type: sequelize.QueryTypes.SELECT });
    const paradasExists = columns.some(col => col.Field === 'paradas');
    
    if (!paradasExists) {
      console.log('Columna paradas no existe, agregándola...');
      await sequelize.query('ALTER TABLE rutas ADD COLUMN paradas TEXT');
      console.log('✅ Columna paradas agregada');
    } else {
      console.log('✅ Columna paradas ya existe');
    }
    
    // Mostrar estructura actualizada
    const updatedColumns = await sequelize.query('DESCRIBE rutas', { type: sequelize.QueryTypes.SELECT });
    console.log('\nEstructura actualizada:', updatedColumns.map(col => ({ Field: col.Field, Type: col.Type })));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

addParadasColumn();
