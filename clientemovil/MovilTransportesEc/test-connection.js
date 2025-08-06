import { AuthService, LocationService } from './src/services/api';

// Función para probar la conectividad con el servidor
const testServerConnection = async () => {
  console.log('🔄 Probando conexión con el servidor...');
  
  try {
    // Probar endpoint de ciudades
    console.log('📍 Probando endpoint de ciudades...');
    const citiesResponse = await LocationService.getCities();
    console.log('✅ Ciudades obtenidas:', citiesResponse);
    
    // Probar login con credenciales de prueba
    console.log('🔐 Probando login...');
    try {
      const loginResponse = await AuthService.login('test@test.com', 'wrongpassword');
      console.log('Login response:', loginResponse);
    } catch (error) {
      console.log('❌ Error esperado en login:', error.message);
    }
    
    console.log('✅ Conexión con servidor establecida correctamente');
    
  } catch (error) {
    console.error('❌ Error de conexión con el servidor:', error);
    console.error('Detalles del error:', error.message);
  }
};

// Ejecutar test
testServerConnection();
