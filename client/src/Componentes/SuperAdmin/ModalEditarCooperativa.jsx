import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Estilos/Modal.css';

const ModalEditarCooperativa = ({ isOpen, onClose, usuario, onSuccess }) => {
  const [formData, setFormData] = useState({
    razon_social: '',
    permiso_operacion: '',
    ruc: '',
    telefono: '',
    estado: 'activo'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario && isOpen) {
      const usuarioCooperativa = usuario.UsuarioCooperativa;
      setFormData({
        razon_social: usuarioCooperativa?.razon_social || '',
        permiso_operacion: usuarioCooperativa?.permiso_operacion || '',
        ruc: usuarioCooperativa?.ruc || '',
        telefono: usuario.telefono || '',
        estado: usuarioCooperativa?.estado || 'activo'
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
        datosCooperativa: {
          razon_social: formData.razon_social,
          permiso_operacion: formData.permiso_operacion,
          ruc: formData.ruc,
          estado: formData.estado
        }
      };

      const response = await axios.put(
        `http://localhost:8000/usuarios/${usuario.id}`,
        updateData
      );

      if (response.data.success) {
        alert('Cooperativa actualizada exitosamente');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al actualizar cooperativa:', error);
      alert('Error al actualizar la cooperativa');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
        <div className="modal-header">
          <h3>🏢 Editar Cooperativa</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px' 
          }}>
            <div className="form-group">
              <label>Razón Social *</label>
              <input
                type="text"
                name="razon_social"
                value={formData.razon_social}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>RUC *</label>
              <input
                type="text"
                name="ruc"
                value={formData.ruc}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Permiso de Operación</label>
              <input
                type="text"
                name="permiso_operacion"
                value={formData.permiso_operacion}
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
              {loading ? 'Actualizando...' : 'Actualizar Cooperativa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarCooperativa;
