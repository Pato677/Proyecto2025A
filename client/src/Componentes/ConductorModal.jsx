import React, { useState, useEffect } from 'react';
import './Estilos/ConductorModal.css';
import Button from './Button';

const ConductorModal = ({ open, onClose, onSave, initialData, mode }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    identificacion: '',
    tipoLicencia: '',
    telefono: '',
    correo: ''
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
        correo: ''
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.identificacion.trim()) newErrors.identificacion = 'La identificación es obligatoria';
    if (!formData.tipoLicencia) newErrors.tipoLicencia = 'Selecciona un tipo de licencia';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    if (!formData.correo.trim()) newErrors.correo = 'El correo es obligatorio';
    
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
      <div className="conductor-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="conductor-modal-header">
          <h2>{mode === 'edit' ? 'Editar Conductor' : 'Agregar Conductor'}</h2>
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
            <label htmlFor="tipoLicencia">Tipo de Licencia *</label>
            <select
              id="tipoLicencia"
              name="tipoLicencia"
              value={formData.tipoLicencia}
              onChange={handleInputChange}
              className={errors.tipoLicencia ? 'error' : ''}
            >
              <option value="">Seleccionar tipo</option>
              <option value="D1(Turismo)">D1 (Turismo)</option>
              <option value="D (Pasajeros)">D (Pasajeros)</option>
              <option value="N/A">N/A</option>
            </select>
            {errors.tipoLicencia && <span className="error-message">{errors.tipoLicencia}</span>}
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