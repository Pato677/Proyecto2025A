import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      const response = await axios.get('http://localhost:8000/ciudades');
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
          `http://localhost:8000/terminales/${terminalToEdit.terminal_id}`, 
          dataToSend
        );
      } else {
        // Crear nuevo terminal
        response = await axios.post('http://localhost:8000/terminales', dataToSend);
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
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            {isEditMode ? 'Editar Terminal' : 'Agregar Nuevo Terminal'}
          </h2>
          <button 
            onClick={onClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGridStyle}>
            {/* Ciudad */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Ciudad *</label>
              <div style={inputContainerStyle}>
                <select
                  name="ciudadId"
                  value={formData.ciudadId}
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                >
                  <option value="">Seleccione una ciudad</option>
                  {ciudades.map(ciudad => (
                    <option key={ciudad.id} value={ciudad.id}>
                      {ciudad.nombre}
                    </option>
                  ))}
                </select>
                <span style={iconStyle}>🏙️</span>
              </div>
            </div>

            {/* Nombre del Terminal */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Nombre del Terminal *</label>
              <div style={inputContainerStyle}>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Terminal Terrestre Norte"
                  style={inputStyle}
                  required
                />
                <span style={iconStyle}>🚌</span>
              </div>
            </div>
          </div>

          {/* Dirección - Full width */}
          <div style={formGroupFullStyle}>
            <label style={labelStyle}>Dirección</label>
            <div style={inputContainerStyle}>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Ej: Av. Principal 123 y Calle Secundaria"
                style={inputStyle}
              />
              <span style={iconStyle}>📍</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...submitButtonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading 
              ? (isEditMode ? 'ACTUALIZANDO...' : 'GUARDANDO...') 
              : (isEditMode ? 'ACTUALIZAR TERMINAL' : 'AGREGAR TERMINAL')
            }
          </button>
        </form>
      </div>
    </div>
  );
};

// Estilos inline inspirados en el formulario de registro
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(5px)'
};

const modalStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  width: '90%',
  maxWidth: '500px',
  maxHeight: '90vh',
  overflow: 'hidden',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
  animation: 'slideIn 0.3s ease-out'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '25px 30px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
};

const titleStyle = {
  color: 'white',
  fontSize: '24px',
  fontWeight: '600',
  margin: 0,
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
};

const closeButtonStyle = {
  background: 'rgba(255, 255, 255, 0.2)',
  border: 'none',
  color: 'white',
  fontSize: '24px',
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease'
};

const formStyle = {
  padding: '30px',
  color: 'white'
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '20px'
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const formGroupFullStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '20px'
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: '600',
  marginBottom: '8px',
  color: 'white',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
};

const inputContainerStyle = {
  position: 'relative'
};

const inputStyle = {
  width: '100%',
  padding: '15px 45px 15px 15px',
  border: 'none',
  borderRadius: '10px',
  fontSize: '14px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#333',
  outline: 'none',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box'
};

const iconStyle = {
  position: 'absolute',
  right: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '18px',
  pointerEvents: 'none'
};

const errorStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#e74c3c',
  padding: '12px 15px',
  borderRadius: '10px',
  marginBottom: '20px',
  fontSize: '14px',
  textAlign: 'center',
  fontWeight: '500'
};

const submitButtonStyle = {
  width: '100%',
  padding: '15px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#5a67d8',
  border: 'none',
  borderRadius: '10px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  letterSpacing: '0.5px',
  textTransform: 'uppercase'
};

export default AgregarTerminalModal;
