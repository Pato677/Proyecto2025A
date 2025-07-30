const { Ruta, UsuarioCooperativa } = require('./models');
const sequelize = require('./config/sequelize.config');

async function checkDatabase() {
  try {
    console.log('=== Verificando estructura de base de datos ===');
    
    // Verificar tabla cooperativas
    console.log('\n1. Verificando tabla cooperativas:');
    const cooperativas = await sequelize.query('SHOW TABLES LIKE "cooperativas"', { type: sequelize.QueryTypes.SELECT });
    console.log('Tabla cooperativas existe:', cooperativas.length > 0);
    
    // Verificar tabla usuarios_cooperativas
    console.log('\n2. Verificando tabla usuarios_cooperativas:');
    const usuariosCooperativas = await sequelize.query('SHOW TABLES LIKE "usuarios_cooperativas"', { type: sequelize.QueryTypes.SELECT });
    console.log('Tabla usuarios_cooperativas existe:', usuariosCooperativas.length > 0);
    
    // Verificar estructura de tabla rutas
    console.log('\n3. Estructura de tabla rutas:');
    const rutasStructure = await sequelize.query('DESCRIBE rutas', { type: sequelize.QueryTypes.SELECT });
    console.log('Estructura rutas:', rutasStructure);
    
    // Verificar foreign keys
    console.log('\n4. Foreign keys de tabla rutas:');
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
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `, { type: sequelize.QueryTypes.SELECT });
    console.log('Foreign keys:', foreignKeys);
    
    // Verificar registros en cooperativas
    console.log('\n5. Registros en tabla cooperativas:');
    const cooperativasData = await sequelize.query('SELECT id, razon_social FROM cooperativas LIMIT 5', { type: sequelize.QueryTypes.SELECT });
    console.log('Datos cooperativas:', cooperativasData);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkDatabase();
