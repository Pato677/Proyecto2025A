import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Estilos/Modal.css';

const ModalEditarUsuario = ({ isOpen, onClose, usuario, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    cedula: '',
    telefono: '',
    estado: 'activo'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario && isOpen) {
      const usuarioFinal = usuario.UsuarioFinal;
      setFormData({
        nombres: usuarioFinal?.nombres || '',
        apellidos: usuarioFinal?.apellidos || '',
        fecha_nacimiento: usuarioFinal?.fecha_nacimiento ? 
          usuarioFinal.fecha_nacimiento.split('T')[0] : '',
        cedula: usuarioFinal?.cedula || '',
        telefono: usuario.telefono || '',
        estado: usuarioFinal?.estado || 'activo'
      });
    }
  }, [usuario, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        telefono: formData.telefono,
        datosUsuarioFinal: {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          fecha_nacimiento: formData.fecha_nacimiento,
          cedula: formData.cedula,
          estado: formData.estado
        }
      };

      const response = await axios.put(
        `http://localhost:8000/usuarios/${usuario.id}`,
        updateData
      );

      if (response.data.success) {
        alert('Usuario actualizado exitosamente');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px', width: '90%' }}>
        <div className="modal-header">
          <h3>✏️ Editar Usuario</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px' 
          }}>
            <div className="form-group">
              <label>Nombres *</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Cédula *</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="form-control"
              >
                <option value="activo">Activo</option>
                <option value="desactivo">Desactivo</option>
              </select>
            </div>
          </div>

          <div className="modal-footer" style={{ marginTop: '24px' }}>
            <button 
              type="button" 
              onClick={onClose}
              className="btn-cancelar"
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                marginRight: '12px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Actualizando...' : 'Actualizar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarUsuario;
