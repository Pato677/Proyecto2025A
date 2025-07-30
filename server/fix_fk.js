const sequelize = require('./config/sequelize.config');

async function fixForeignKey() {
  try {
    console.log('=== Eliminando foreign key vieja ===');
    
    // Eliminar la constraint vieja que apunta a usuarios_cooperativas
    await sequelize.query('ALTER TABLE rutas DROP FOREIGN KEY rutas_ibfk_89');
    console.log('✅ Foreign key rutas_ibfk_89 eliminada');
    
    // Verificar que solo quede la constraint correcta
    const foreignKeys = await sequelize.query(`
      SELECT 
        CONSTRAINT_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM 
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE 
        TABLE_SCHEMA = 'transportesec' 
        AND TABLE_NAME = 'rutas' 
        AND COLUMN_NAME = 'cooperativa_id'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log('Foreign keys restantes para cooperativa_id:', foreignKeys);
    
    // Verificar que podemos insertar una ruta con cooperativa_id = 1
    console.log('\n=== Probando inserción ===');
    const testResult = await sequelize.query(`SELECT id FROM cooperativas WHERE id = 1`, { type: sequelize.QueryTypes.SELECT });
    console.log('Cooperativa con ID 1 existe:', testResult.length > 0);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

fixForeignKey();
