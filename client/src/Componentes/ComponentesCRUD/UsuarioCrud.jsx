import axios from "axios";

const API_URL = "http://localhost:8000/usuarios"; 

const UsuarioCrud = {
  // Crear un nuevo usuario
  crearUsuario: async (usuarioData) => {
    try {
      const response = await axios.post(API_URL, usuarioData);
      return response.data;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  },

  // Obtener todos los usuarios
  obtenerUsuarios: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
    // Actualizar un usuario
  actualizarUsuario: async (id, usuarioData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, usuarioData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  },

  // Eliminar un usuario
  eliminarUsuario: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  },

  // Obtener un usuario por ID
  obtenerUsuarioPorId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error;
    }
  },



  // Verificar si un correo ya existe
  verificarCorreoExistente: async (correo) => {
    try {
      const response = await axios.get(`${API_URL}/verificar-email/${encodeURIComponent(correo)}`);
      return response.data.existe;
    } catch (error) {
      console.error("Error al verificar correo:", error);
      throw error;
    }
  },

    // Verificar credenciales de usuario (Login)
    login: async (correo, contrasena) => {
        try {
            const response = await axios.post(`http://localhost:8000/auth/login`, {
                correo,
                contrasena
            }, {
                timeout: 10000, // Timeout de 10 segundos
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // Si el login es exitoso, guardar el token en localStorage
            if (response.data.success && response.data.token) {
                // Usar setTimeout para evitar problemas de renderizado concurrente
                setTimeout(() => {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
                    localStorage.setItem('dashboard', response.data.configuracion.dashboard);
                }, 0);
            }
            
            return response.data;
        } catch (error) {
            console.error('Error en login:', error);
            if (error.response) {
                // Error del servidor con respuesta
                throw new Error(error.response.data.message || 'Error al iniciar sesión');
            } else if (error.code === 'ECONNABORTED') {
                // Error de timeout
                throw new Error('Tiempo de espera agotado. Verifique su conexión.');
            } else {
                // Error de red u otro
                throw new Error('Error de conexión con el servidor');
            }
        }
    },

    // Método legacy para compatibilidad (puede ser removido después)
    verificarCredenciales: async (correo, contrasena) => {
        try {
            const loginResponse = await UsuarioCrud.login(correo, contrasena);
            return loginResponse.success ? loginResponse : null;
        } catch (error) {
            console.error("Error al verificar credenciales:", error);
            return null;
        }
    },

  // Verificar si una cédula ya existe
  verificarCedulaExistente: async (cedula) => {
    try {
      const response = await axios.get(`${API_URL}/verificar-cedula/${cedula}`);
      return response.data.existe;
    } catch (error) {
      console.error("Error al verificar cédula:", error);
      throw error;
    }
  }
  
};

export default UsuarioCrud;