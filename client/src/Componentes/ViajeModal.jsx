import React, { useState, useEffect } from 'react';
import './Estilos/ViajeModal.css';

const ViajeModal = ({ open, onClose, onSave, initialData, mode, rutas, unidades }) => {
  const [viaje, setViaje] = useState({
    fecha_salida: '',
    fecha_llegada: '',
    numero_asientos_ocupados: '',
    precio: '',
    ruta_id: '',
    unidad_id: ''
  });

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setViaje({
        fecha_salida: formatDateForInput(initialData.fecha_salida),
        fecha_llegada: formatDateForInput(initialData.fecha_llegada),
        numero_asientos_ocupados: initialData.numero_asientos_ocupados || '',
        precio: initialData.precio || '',
        ruta_id: initialData.ruta_id || '',
        unidad_id: initialData.unidad_id || ''
      });
    } else {
      setViaje({
        fecha_salida: '',
        fecha_llegada: '',
        numero_asientos_ocupados: '',
        precio: '',
        ruta_id: '',
        unidad_id: ''
      });
    }
  }, [mode, initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setViaje(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!viaje.fecha_salida || !viaje.fecha_llegada || !viaje.precio || !viaje.ruta_id || !viaje.unidad_id) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    if (new Date(viaje.fecha_salida) >= new Date(viaje.fecha_llegada)) {
      alert('La fecha de llegada debe ser posterior a la fecha de salida');
      return;
    }

    // Convertir a formato correcto para enviar
    const viajeToSend = {
      ...viaje,
      numero_asientos_ocupados: parseInt(viaje.numero_asientos_ocupados) || 0,
      precio: parseFloat(viaje.precio) || 0,
      ruta_id: parseInt(viaje.ruta_id),
      unidad_id: parseInt(viaje.unidad_id)
    };

    onSave(viajeToSend);
  };

  if (!open) return null;

  console.log('ViajeModal renderizado - open:', open, 'mode:', mode);

  return (
    <div className="viaje-modal-bg">
      <div className="viaje-modal-content">
        <button className="viaje-modal-close" onClick={onClose}>×</button>
        <h2>{mode === 'edit' ? 'Editar Viaje' : 'Agregar Viaje'}</h2>
        <form onSubmit={handleSubmit} className="viaje-modal-form">
          <input
            type="datetime-local"
            name="fecha_salida"
            placeholder="Fecha de Salida"
            value={viaje.fecha_salida}
            onChange={handleChange}
            required
          />
          
          <input
            type="datetime-local"
            name="fecha_llegada"
            placeholder="Fecha de Llegada"
            value={viaje.fecha_llegada}
            onChange={handleChange}
            required
          />
          
          <input
            type="number"
            name="numero_asientos_ocupados"
            placeholder="Número de Asientos Ocupados"
            value={viaje.numero_asientos_ocupados}
            onChange={handleChange}
            min="0"
          />
          
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={viaje.precio}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
          
          <select
            name="ruta_id"
            value={viaje.ruta_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una ruta</option>
            {rutas.map(ruta => (
              <option key={ruta.id} value={ruta.id}>
                {ruta.origen} - {ruta.destino}
              </option>
            ))}
          </select>
          
          <select
            name="unidad_id"
            value={viaje.unidad_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una unidad</option>
            {unidades.map(unidad => (
              <option key={unidad.id} value={unidad.id}>
                {unidad.placa} - {unidad.marca} {unidad.modelo}
              </option>
            ))}
          </select>

          <div className="viaje-modal-btns">
            <button type="button" onClick={onClose} className="viaje-modal-cancel">
              Cancelar
            </button>
            <button type="submit" className="viaje-modal-save">
              {mode === 'edit' ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViajeModal;
