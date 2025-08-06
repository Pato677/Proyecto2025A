import React, { useState, useEffect } from 'react';
import './Estilos/ConductorModal.css';
import Button from './Button';

const ConductorModal = ({ open, onClose, onSave, initialData, mode }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    identificacion: '',
    tipoLicencia: '',
    telefono: '',
    correo: '',
    roles: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData(initialData);
    } else {
      setFormData({
        nombre: '',
        identificacion: '',
        tipoLicencia: '',
        telefono: '',
        correo: '',
        roles: []
      });
    }
    setErrors({});
  }, [initialData, mode, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => {
      const currentRoles = prev.roles || [];
      const hasRole = currentRoles.includes(role);
      
      if (hasRole) {
        return { ...prev, roles: currentRoles.filter(r => r !== role) };
      } else {
        return { ...prev, roles: [...currentRoles, role] };
      }
    });
    
    // Limpiar error de roles si existe
    if (errors.roles) {
      setErrors(prev => ({ ...prev, roles: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.identificacion.trim()) newErrors.identificacion = 'La identificación es obligatoria';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    if (!formData.correo.trim()) newErrors.correo = 'El correo es obligatorio';
    if (!formData.roles || formData.roles.length === 0) newErrors.roles = 'Debe seleccionar al menos un rol';
    
    // Validar licencia solo si es conductor
    if (formData.roles && formData.roles.includes('conductor') && !formData.tipoLicencia) {
      newErrors.tipoLicencia = 'El tipo de licencia es obligatorio para conductores';
    }
    
    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correo && !emailRegex.test(formData.correo)) {
      newErrors.correo = 'Formato de correo inválido';
    }

    // Validar formato de teléfono (10 dígitos)
    const phoneRegex = /^\d{10}$/;
    if (formData.telefono && !phoneRegex.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!open) return null;

  return (
    <div className="conductor-modal-overlay" onClick={onClose}>
      <div
        className="conductor-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div className="conductor-modal-header">
          <h2>{mode === 'edit' ? 'Editar Personal' : 'Agregar Personal'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="conductor-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={errors.nombre ? 'error' : ''}
              placeholder="Ej: Juan Pérez González"
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="identificacion">Identificación *</label>
            <input
              type="text"
              id="identificacion"
              name="identificacion"
              value={formData.identificacion}
              onChange={handleInputChange}
              className={errors.identificacion ? 'error' : ''}
              placeholder="Ej: 1234567890"
            />
            {errors.identificacion && <span className="error-message">{errors.identificacion}</span>}
          </div>

          <div className="form-group">
            <label>Roles *</label>
            <div className="roles-container" style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.roles?.includes('conductor') || false}
                  onChange={() => handleRoleChange('conductor')}
                  style={{ marginRight: '8px' }}
                />
                Conductor
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.roles?.includes('controlador') || false}
                  onChange={() => handleRoleChange('controlador')}
                  style={{ marginRight: '8px' }}
                />
                Controlador
              </label>
            </div>
            {errors.roles && <span className="error-message">{errors.roles}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tipoLicencia">
              Tipo de Licencia {formData.roles?.includes('conductor') ? '*' : ''}
            </label>
            <select
              id="tipoLicencia"
              name="tipoLicencia"
              value={formData.tipoLicencia}
              onChange={handleInputChange}
              className={errors.tipoLicencia ? 'error' : ''}
              disabled={!formData.roles?.includes('conductor')}
            >
              <option value="">Seleccionar tipo</option>
              <option value="D1(Turismo)">D1 (Turismo)</option>
              <option value="D (Pasajeros)">D (Pasajeros)</option>
              <option value="N/A">N/A</option>
            </select>
            {errors.tipoLicencia && <span className="error-message">{errors.tipoLicencia}</span>}
            {!formData.roles?.includes('conductor') && (
              <small style={{ color: '#666', fontSize: '0.85rem' }}>
                Solo requerido para conductores
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Número Telefónico *</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className={errors.telefono ? 'error' : ''}
              placeholder="Ej: 0999999999"
            />
            {errors.telefono && <span className="error-message">{errors.telefono}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              className={errors.correo ? 'error' : ''}
              placeholder="Ej: conductor@email.com"
            />
            {errors.correo && <span className="error-message">{errors.correo}</span>}
          </div>

          <div className="modal-actions">
            <Button text="Cancelar" width="120px" onClick={onClose} />
            <Button text={mode === 'edit' ? 'Actualizar' : 'Guardar'} width="120px" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConductorModal;