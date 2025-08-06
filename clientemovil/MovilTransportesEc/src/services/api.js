import axios from 'axios';

const API_BASE_URL = 'http://192.168.247.115:8000'; // IP de tu PC

// Configuración global de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const AuthService = {
  // Login de usuario
  login: async (correo, contrasena) => {
    try {
      const response = await api.post('/auth/login', {
        correo,
        contrasena,
      });
      return response.data;
    } catch (error) {
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
      const response = await api.get('/ciudades');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener ciudades');
    }
  },

  // Obtener terminales por ciudad
  getTerminalsByCity: async (ciudadId) => {
    try {
      const response = await api.get(`/terminales/ciudad/${ciudadId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener terminales');
    }
  },
};

export default api;
