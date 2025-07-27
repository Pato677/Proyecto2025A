import React, { useState, useEffect } from 'react';
import './Estilos/ViajeUpdateModal.css';
import axios from 'axios';

const ViajeUpdateModal = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    precio: '',
    unidad_id: ''
  });
  const [unidades, setUnidades] = useState([]);

  // Cargar unidades de la cooperativa 1 al abrir el modal
  useEffect(() => {
    if (open) {
      axios.get('http://localhost:8000/unidades/cooperativa/1')
        .then(res => {
          // Si la respuesta tiene estructura con data, usar res.data.data, sino res.data
          const unidadesData = res.data.data || res.data;
          setUnidades(Array.isArray(unidadesData) ? unidadesData : []);
        })
        .catch(error => {
          console.error('Error al cargar unidades:', error);
          setUnidades([]);
        });
    }
  }, [open]);

  // Llenar el formulario con los datos iniciales cuando se abre para editar
  useEffect(() => {
    if (open && initialData) {
      setFormData({
        precio: initialData.precio || '',
        unidad_id: initialData.unidad_id || ''
      });
    }
  }, [open, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.precio || !formData.unidad_id) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (parseFloat(formData.precio) <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }

    // Enviar datos para actualizar
    onSave({
      precio: parseFloat(formData.precio),
      unidad_id: parseInt(formData.unidad_id)
    });
  };

  const handleClose = () => {
    setFormData({
      precio: '',
      unidad_id: ''
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="viaje-update-modal-bg" onClick={handleClose}>
      <div className="viaje-update-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="viaje-update-modal-close" onClick={handleClose}>
          ×
        </button>
        
        <h2>Actualizar Viaje</h2>
        <p className="viaje-update-modal-subtitle">
          Solo puedes modificar la unidad y el precio
        </p>

        <form className="viaje-update-modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Precio *</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              placeholder="Ej: 50.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Unidad *</label>
            <select
              name="unidad_id"
              value={formData.unidad_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona una unidad</option>
              {unidades.map(unidad => (
                <option key={unidad.id} value={unidad.id}>
                  {`Placa: ${unidad.placa} - Unidad: ${unidad.numero_unidad}`}
                </option>
              ))}
            </select>
          </div>

          <div className="viaje-update-modal-btns">
            <button type="button" className="viaje-update-modal-cancel" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="viaje-update-modal-save">
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViajeUpdateModal;
