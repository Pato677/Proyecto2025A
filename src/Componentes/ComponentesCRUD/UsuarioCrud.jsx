import axios from "axios";

const API_URL = "http://localhost:3000/UsuarioPasajero";

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

  // Verificar si un correo ya existe
  verificarCorreoExistente: async (correo) => {
    try {
      const response = await axios.get(`${API_URL}?correo=${correo}`);
      return response.data.length > 0;
    } catch (error) {
      console.error("Error al verificar correo:", error);
      throw error;
    }
  },

  // Verificar si una cédula ya existe
  verificarCedulaExistente: async (cedula) => {
    try {
      const response = await axios.get(`${API_URL}?cedula=${cedula}`);
      return response.data.length > 0;
    } catch (error) {
      console.error("Error al verificar cédula:", error);
      throw error;
    }
  }
};

export default UsuarioCrud;