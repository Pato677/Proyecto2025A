import axios from 'axios';

const API_BASE_URL = 'http://192.168.247.115:8000'; // IP de tu PC

// Configuración global de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Aumentado timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests (agregar logs)
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📤 Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses (agregar logs)
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    console.log('📥 Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    
    // Mejorar mensajes de error para problemas comunes
    if (error.code === 'ECONNABORTED') {
      error.message = 'Tiempo de espera agotado. Verifica tu conexión a internet.';
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      error.message = 'Error de conexión. Verifica que el servidor esté funcionando.';
    }
    
    return Promise.reject(error);
  }
);

export const AuthService = {
  // Login de usuario
  login: async (correo, contrasena) => {
    try {
      console.log('Making login request to:', `${API_BASE_URL}/auth/login`);
      const response = await api.post('/auth/login', {
        correo,
        contrasena,
      });
      console.log('Login API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },

  // Registro de usuario final
  register: async (userData) => {
    try {
      const response = await api.post('/auth/registro/usuario', {
        correo: userData.correo,
        contrasena: userData.contrasena,
        telefono: userData.telefono,
        datosUsuarioFinal: {
          nombres: userData.nombres,
          apellidos: userData.apellidos,
          fecha_nacimiento: userData.fechaNacimiento,
          cedula: userData.cedula,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  },

  // Verificar si el correo ya existe
  checkEmailExists: async (correo) => {
    try {
      const response = await api.get(`/auth/verificar-correo/${correo}`);
      return response.data.existe;
    } catch (error) {
      return false;
    }
  },

  // Verificar si la cédula ya existe
  checkCedulaExists: async (cedula) => {
    try {
      const response = await api.get(`/auth/verificar-cedula/${cedula}`);
      return response.data.existe;
    } catch (error) {
      return false;
    }
  },
};

export const TripService = {
  // Buscar viajes por fecha y filtros
  searchTrips: async (params) => {
    try {
      const { fecha, page = 1, size = 10, orden, terminalOrigen, terminalDestino } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (orden) queryParams.append('orden', orden);
      if (terminalOrigen) queryParams.append('terminalOrigen', terminalOrigen);
      if (terminalDestino) queryParams.append('terminalDestino', terminalDestino);

      const response = await api.get(`/viajes/fecha/${fecha}?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al buscar viajes');
    }
  },

  // Obtener detalles de un viaje específico
  getTripDetails: async (viajeId) => {
    try {
      const response = await api.get(`/viajes/${viajeId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener detalles del viaje');
    }
  },
};

export const LocationService = {
  // Obtener ciudades
  getCities: async () => {
    try {
      console.log('Making cities request to:', `${API_BASE_URL}/ciudades`);
      const response = await api.get('/ciudades');
      console.log('Cities API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Cities API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener ciudades');
    }
  },

  // Obtener terminales por ciudad
  getTerminalsByCity: async (ciudadId) => {
    try {
      console.log('Making terminals request to:', `${API_BASE_URL}/terminales/ciudad/${ciudadId}`);
      const response = await api.get(`/terminales/ciudad/${ciudadId}`);
      console.log('Terminals API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Terminals API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener terminales');
    }
  },
};

export default api;
