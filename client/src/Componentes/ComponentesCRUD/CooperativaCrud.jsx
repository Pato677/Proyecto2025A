import axios from "axios";

const API_URL = "http://localhost:8000/auth/registro"; 

const CooperativaCrud = {
  // Registrar nueva cooperativa
  registrarCooperativa: async (cooperativaData) => {
    try {
      const response = await axios.post(`${API_URL}/cooperativa`, cooperativaData);
      return response.data;
    } catch (error) {
      console.error("Error al registrar cooperativa:", error);
      throw error;
    }
  },

  // Verificar si un correo ya existe
  verificarCorreoExistente: async (correo) => {
    try {
      const response = await axios.get(`http://localhost:8000/usuario/verificar-email/${encodeURIComponent(correo)}`);
      return response.data.existe;
    } catch (error) {
      console.error("Error al verificar correo:", error);
      // Si hay error en la verificación, asumimos que no existe para que continúe el proceso
      return false;
    }
  },

  // Verificar si un RUC ya existe
  verificarRucExistente: async (ruc) => {
    try {
      // Por ahora retornamos false hasta implementar el endpoint en el backend
      return false;
      // TODO: Implementar verificación de RUC cuando esté disponible el endpoint
      // const response = await axios.get(`http://localhost:8000/usuario/verificar-ruc/${ruc}`);
      // return response.data.existe;
    } catch (error) {
      console.error("Error al verificar RUC:", error);
      return false;
    }
  }
};

export default CooperativaCrud;
