// Script de migración para actualizar las tablas con los nuevos campos
const sequelize = require('./config/sequelize.config');

async function migrarBaseDeDatos() {
  try {
    console.log('=== Iniciando migración de base de datos ===');

    // Agregar columnas a usuarios_finales
    console.log('Actualizando tabla usuarios_finales...');
    
    try {
      await sequelize.query(`
        ALTER TABLE usuarios_finales 
        ADD COLUMN IF NOT EXISTS genero VARCHAR(255),
        ADD COLUMN IF NOT EXISTS direccion VARCHAR(255),
        ADD COLUMN IF NOT EXISTS ciudad VARCHAR(255),
        ADD COLUMN IF NOT EXISTS estado VARCHAR(255) DEFAULT 'desactivo'
      `);
      console.log('✅ Tabla usuarios_finales actualizada');
    } catch (error) {
      console.log('⚠️ Error en usuarios_finales (puede que ya existan):', error.message);
    }

    // Actualizar usuarios_cooperativas para agregar default al estado
    console.log('Actualizando tabla usuarios_cooperativas...');
    
    try {
      await sequelize.query(`
        ALTER TABLE usuarios_cooperativas 
        MODIFY COLUMN estado VARCHAR(255) DEFAULT 'desactivo'
      `);
      console.log('✅ Tabla usuarios_cooperativas actualizada');
    } catch (error) {
      console.log('⚠️ Error en usuarios_cooperativas:', error.message);
    }

    // Eliminar columna estado de tabla usuarios si existe
    console.log('Eliminando columna estado de tabla usuarios...');
    
    try {
      await sequelize.query(`
        ALTER TABLE usuarios 
        DROP COLUMN IF EXISTS estado
      `);
      console.log('✅ Columna estado eliminada de usuarios');
    } catch (error) {
      console.log('⚠️ Error eliminando estado de usuarios:', error.message);
    }

    // Establecer estado por defecto para usuarios existentes
    console.log('Estableciendo estado por defecto para usuarios existentes...');
    
    try {
      await sequelize.query(`
        UPDATE usuarios_finales 
        SET estado = 'desactivo' 
        WHERE estado IS NULL
      `);
      console.log('✅ Estados de usuarios_finales actualizados');
    } catch (error) {
      console.log('⚠️ Error actualizando estados usuarios_finales:', error.message);
    }

    try {
      await sequelize.query(`
        UPDATE usuarios_cooperativas 
        SET estado = 'desactivo' 
        WHERE estado IS NULL
      `);
      console.log('✅ Estados de usuarios_cooperativas actualizados');
    } catch (error) {
      console.log('⚠️ Error actualizando estados usuarios_cooperativas:', error.message);
    }

    console.log('=== Migración completada ===');
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
  } finally {
    await sequelize.close();
  }
}

migrarBaseDeDatos();
