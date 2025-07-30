// Script de migración mejorado para MySQL
const sequelize = require('./config/sequelize.config');

async function verificarColumnaExiste(tabla, columna) {
  try {
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = '${tabla}' 
      AND COLUMN_NAME = '${columna}' 
      AND TABLE_SCHEMA = DATABASE()
    `);
    return results.length > 0;
  } catch (error) {
    return false;
  }
}

async function migrarBaseDeDatos() {
  try {
    console.log('=== Iniciando migración de base de datos ===');

    // Verificar y agregar columnas a usuarios_finales
    console.log('Verificando usuarios_finales...');
    
    const columnasFinales = ['direccion', 'ciudad', 'estado'];
    
    for (const columna of columnasFinales) {
      const existe = await verificarColumnaExiste('usuarios_finales', columna);
      if (!existe) {
        try {
          let sql = `ALTER TABLE usuarios_finales ADD COLUMN ${columna} VARCHAR(255)`;
          if (columna === 'estado') {
            sql += " DEFAULT 'desactivo'";
          }
          await sequelize.query(sql);
          console.log(`✅ Columna ${columna} agregada a usuarios_finales`);
        } catch (error) {
          console.log(`⚠️ Error agregando ${columna}:`, error.message);
        }
      } else {
        console.log(`ℹ️ Columna ${columna} ya existe en usuarios_finales`);
      }
    }

    // Verificar y eliminar columna estado de usuarios
    console.log('Verificando usuarios...');
    const existeEstadoUsuarios = await verificarColumnaExiste('usuarios', 'estado');
    if (existeEstadoUsuarios) {
      try {
        await sequelize.query('ALTER TABLE usuarios DROP COLUMN estado');
        console.log('✅ Columna estado eliminada de usuarios');
      } catch (error) {
        console.log('⚠️ Error eliminando estado de usuarios:', error.message);
      }
    } else {
      console.log('ℹ️ Columna estado no existe en usuarios');
    }

    // Establecer valores por defecto
    console.log('Estableciendo valores por defecto...');
    
    try {
      await sequelize.query(`
        UPDATE usuarios_finales 
        SET estado = 'desactivo' 
        WHERE estado IS NULL OR estado = ''
      `);
      console.log('✅ Estados de usuarios_finales actualizados');
    } catch (error) {
      console.log('⚠️ Error actualizando estados usuarios_finales:', error.message);
    }

    try {
      await sequelize.query(`
        UPDATE usuarios_cooperativas 
        SET estado = 'desactivo' 
        WHERE estado IS NULL OR estado = ''
      `);
      console.log('✅ Estados de usuarios_cooperativas actualizados');
    } catch (error) {
      console.log('⚠️ Error actualizando estados usuarios_cooperativas:', error.message);
    }

    console.log('=== Migración completada exitosamente ===');
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
  } finally {
    await sequelize.close();
  }
}

migrarBaseDeDatos();
