require('dotenv').config();
const sequelize = require('./config/sequelize.config');
const Usuario = require('./models/usuario.model');

async function activarUsuario() {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida exitosamente.');
    
    const resultado = await Usuario.update(
      { estado: 'activo' },
      { where: { correo: 'activa@test.com' } }
    );
    
    console.log(`Usuario actualizado. Filas afectadas: ${resultado[0]}`);
    
    const usuario = await Usuario.findOne({ where: { correo: 'activa@test.com' } });
    console.log(`Estado del usuario: ${usuario.estado}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

activarUsuario();
