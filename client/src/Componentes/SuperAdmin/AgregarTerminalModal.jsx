import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Estilos/Modal.css';

const AgregarTerminalModal = ({ open, onClose, onSave, terminalToEdit = null }) => {
  const [formData, setFormData] = useState({
    ciudadId: '',
    nombre: '',
    direccion: ''
  });
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = terminalToEdit !== null;

  // Cargar ciudades al abrir el modal
  useEffect(() => {
    if (open) {
      cargarCiudades();
      setError('');
      
      // Si es modo edición, precargar los datos
      if (isEditMode && terminalToEdit) {
        setFormData({
          ciudadId: terminalToEdit.ciudad_id.toString(),
          nombre: terminalToEdit.terminal_nombre,
          direccion: terminalToEdit.terminal_direccion || ''
        });
      } else {
        // Si es modo agregar, limpiar formulario
        setFormData({
          ciudadId: '',
          nombre: '',
          direccion: ''
        });
      }
    }
  }, [open, isEditMode, terminalToEdit]);

  const cargarCiudades = async () => {
    try {
      const response = await axios.get('http://localhost:3000/ciudades');
      setCiudades(response.data);
    } catch (err) {
      console.error('Error al cargar ciudades:', err);
      setError('Error al cargar las ciudades');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.ciudadId) {
      setError('Por favor seleccione una ciudad');
      return;
    }
    if (!formData.nombre.trim()) {
      setError('Por favor ingrese el nombre del terminal');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dataToSend = {
        nombre: formData.nombre.trim(),
        ciudadId: parseInt(formData.ciudadId),
        direccion: formData.direccion.trim() || null
      };

      let response;
      if (isEditMode) {
        // Actualizar terminal existente
        response = await axios.put(
          `http://localhost:3000/terminales/${terminalToEdit.terminal_id}`, 
          dataToSend
        );
      } else {
        // Crear nuevo terminal
        response = await axios.post('http://localhost:3000/terminales', dataToSend);
      }

      if (response.status === 200 || response.status === 201) {
        onSave(); // Callback para recargar datos
        onClose(); // Cerrar modal
      }
    } catch (err) {
      console.error('Error al guardar terminal:', err);
      
      // Manejo más específico de errores
      let errorMessage = `Error al ${isEditMode ? 'actualizar' : 'crear'} el terminal`;
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 404) {
        errorMessage = 'Terminal no encontrado';
      } else if (err.response?.status === 400) {
        errorMessage = 'Datos inválidos. Verifique la información ingresada';
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Error de conexión con el servidor';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-container modal-large ${isEditMode ? 'modal-edit-mode' : ''}`}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Editar Terminal' : 'Agregar Nuevo Terminal'}</h2>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            {/* Ciudad */}
            <div className="form-group">
              <label htmlFor="ciudadId">Ciudad *</label>
              <div className="input-container">
                <select
                  id="ciudadId"
                  name="ciudadId"
                  value={formData.ciudadId}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Seleccione una ciudad</option>
                  {ciudades.map(ciudad => (
                    <option key={ciudad.id} value={ciudad.id}>
                      {ciudad.nombre}
                    </option>
                  ))}
                </select>
                <span className="input-icon">🏙️</span>
              </div>
            </div>

            {/* Nombre del Terminal */}
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Terminal *</label>
              <div className="input-container">
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Terminal Terrestre Norte"
                  className="form-input"
                  required
                />
                <span className="input-icon">🚌</span>
              </div>
            </div>

            {/* Dirección */}
            <div className="form-group form-group-full">
              <label htmlFor="direccion">Dirección</label>
              <div className="input-container">
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Ej: Av. Principal 123 y Calle Secundaria"
                  className="form-input"
                />
                <span className="input-icon">📍</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancelar"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-agregar"
              disabled={loading}
            >
              {loading 
                ? (isEditMode ? 'Actualizando...' : 'Guardando...') 
                : (isEditMode ? 'Actualizar Terminal' : 'Agregar Terminal')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarTerminalModal;
