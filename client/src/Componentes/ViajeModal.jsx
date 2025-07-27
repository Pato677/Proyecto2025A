import React, { useState, useEffect } from 'react';
import './Estilos/ViajeModal.css';

const COOPERATIVA_ID = 1; // ID de la cooperativa para pruebas

const ViajeModal = ({ open, onClose, onSave, onSaveMultiple, rutas, unidades }) => {
  const [viaje, setViaje] = useState({
    fecha_salida: '',
    fecha_llegada: '',
    numero_asientos_ocupados: '',
    precio: '',
    ruta_id: '',
    unidad_id: ''
  });

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (open) {
      setViaje({
        fecha_salida: '',
        fecha_llegada: '',
        numero_asientos_ocupados: '',
        precio: '',
        ruta_id: '',
        unidad_id: ''
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setViaje(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas para viaje único
    if (!viaje.fecha_salida) {
      alert('Por favor, complete la fecha de salida');
      return;
    }

    if (!viaje.precio) {
      alert('Por favor, complete el precio para crear un viaje único');
      return;
    }

    if (!viaje.ruta_id || !viaje.unidad_id) {
      alert('Para crear un viaje único, debe seleccionar una ruta y una unidad específicas');
      return;
    }

    if (viaje.fecha_llegada && new Date(viaje.fecha_salida) >= new Date(viaje.fecha_llegada)) {
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

  const handleCreateMultipleTrips = () => {
    // Validación básica para múltiples viajes - solo requiere fecha de salida
    if (!viaje.fecha_salida) {
      alert('Por favor, complete la fecha de salida para crear viajes múltiples');
      return;
    }

    // Verificar que hay rutas disponibles
    if (!rutas || rutas.length === 0) {
      alert('No hay rutas disponibles para esta cooperativa');
      return;
    }

    // Filtrar rutas que pertenecen a la cooperativa (validación adicional)
    const rutasCooperativa = rutas.filter(ruta => ruta.cooperativa_id === COOPERATIVA_ID);
    console.log(`Rutas totales: ${rutas.length}, Rutas de cooperativa ${COOPERATIVA_ID}: ${rutasCooperativa.length}`);
    const cantidadRutas = rutasCooperativa.length > 0 ? rutasCooperativa.length : rutas.length;

    if (window.confirm(`¿Estás seguro de que deseas crear ${cantidadRutas} viajes (uno por cada ruta de la cooperativa) para la fecha ${viaje.fecha_salida}?\n\nNota: Los viajes se crearán con precio $0.00 y sin unidades asignadas. Podrá configurarlos después usando el botón "Actualizar".`)) {
      const viajesData = {
        fecha_salida: viaje.fecha_salida,
        fecha_llegada: viaje.fecha_llegada || viaje.fecha_salida, // Si no hay fecha de llegada, usar la misma fecha de salida
        numero_asientos_ocupados: parseInt(viaje.numero_asientos_ocupados) || 0,
        precio: 0, // Precio por defecto en 0 para poder modificar después
        rutas: rutasCooperativa.length > 0 ? rutasCooperativa : rutas // Usar rutas filtradas si están disponibles
      };

      if (onSaveMultiple) {
        onSaveMultiple(viajesData);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="viaje-modal-bg">
      <div className="viaje-modal-content">
        <button className="viaje-modal-close" onClick={onClose}>×</button>
        <h2>Crear Nuevo Viaje</h2>
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
          />
          
          <input
            type="number"
            name="numero_asientos_ocupados"
            placeholder="Número de Asientos Ocupados (opcional)"
            value={viaje.numero_asientos_ocupados}
            onChange={handleChange}
            min="0"
          />
          
          <input
            type="number"
            name="precio"
            placeholder="Precio (solo para viaje único)"
            value={viaje.precio}
            onChange={handleChange}
            step="0.01"
            min="0"
          />
          
          <select
            name="ruta_id"
            value={viaje.ruta_id}
            onChange={handleChange}
          >
            <option value="">Seleccione una ruta (solo para viaje único)</option>
            {rutas.map(ruta => (
              <option key={ruta.id} value={ruta.id}>
                Ruta {ruta.numero_ruta || ruta.id} - {ruta.hora_salida || 'N/A'} a {ruta.hora_llegada || 'N/A'}
              </option>
            ))}
          </select>
          
          <select
            name="unidad_id"
            value={viaje.unidad_id}
            onChange={handleChange}
          >
            <option value="">Seleccione una unidad (solo para viaje único)</option>
            {unidades.map(unidad => (
              <option key={unidad.id} value={unidad.id}>
                Placa: {unidad.placa} - Unidad: {unidad.numero_unidad}
              </option>
            ))}
          </select>

          <div className="info-multiple-trips">
            <p><strong>Nota:</strong> Para crear múltiples viajes, solo necesita especificar la fecha de salida. 
            Se crearán viajes para todas las rutas de la cooperativa ({rutas.length} rutas disponibles). 
            Los precios se establecerán en $0.00 y las unidades quedarán sin asignar. 
            Podrá modificar precios y asignar unidades después usando el botón "Actualizar".</p>
          </div>

          <div className="viaje-modal-btns">
            <button type="button" onClick={onClose} className="viaje-modal-cancel">
              Cancelar
            </button>
            <button type="button" onClick={handleCreateMultipleTrips} className="viaje-modal-multiple">
              Crear Viajes para Todas las Rutas ({rutas.length})
            </button>
            <button type="submit" className="viaje-modal-save">
              Crear Un Viaje
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViajeModal;
