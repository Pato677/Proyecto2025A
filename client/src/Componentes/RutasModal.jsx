import React, { useState, useEffect } from 'react';
import SimpleErrorModal from './SimpleErrorModal';
import './Estilos/RutasModal.css';

const initialState = {
  numeroRuta: '',
  terminalOrigenId: '',
  terminalDestinoId: '',
  horaSalida: '',
  horaLlegada: ''
};

const RutaModal = ({ open, onClose, onSave, initialData, mode = 'add', terminales, loading}) => {
  const [form, setForm] = useState(initialState);

  // Estado para el modal de error
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Función helper para mostrar errores
  const mostrarError = (mensaje) => {
    setErrorMessage(mensaje);
    setShowErrorModal(true);
  };

  useEffect(() => {
    if (initialData && mode === 'edit') {
      // Encontrar los IDs de los terminales basados en los nombres
      const terminalOrigen = terminales.find(t => t.nombre === initialData.terminalOrigen);
      const terminalDestino = terminales.find(t => t.nombre === initialData.terminalDestino);
      
      setForm({
        numeroRuta: initialData.numeroRuta || '',
        terminalOrigenId: terminalOrigen?.id || '',
        terminalDestinoId: terminalDestino?.id || '',
        horaSalida: initialData.horaSalida || '',
        horaLlegada: initialData.horaLlegada || ''
      });
    } else {
      setForm(initialState);
    }
  }, [initialData, open, mode, terminales]);

  if (!open) return null;

  // Agrupar terminales por ciudad
  const terminalesPorCiudad = terminales.reduce((acc, terminal) => {
    if (!acc[terminal.ciudad]) {
      acc[terminal.ciudad] = [];
    }
    acc[terminal.ciudad].push(terminal);
    return acc;
  }, {});

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!form.numeroRuta || !form.terminalOrigenId || !form.terminalDestinoId || !form.horaSalida || !form.horaLlegada) {
      mostrarError('Por favor complete todos los campos requeridos');
      return;
    }

    if (form.terminalOrigenId === form.terminalDestinoId) {
      mostrarError('El terminal de origen y destino no pueden ser el mismo');
      return;
    }

    // Preparar datos para enviar
    const rutaData = {
      ...form,
      terminalOrigenId: parseInt(form.terminalOrigenId),
      terminalDestinoId: parseInt(form.terminalDestinoId)
    };

    onSave(rutaData);
  };

  return (
    <div className="ruta-modal-bg">
      <div className="ruta-modal-content">
        <button className="ruta-modal-close" onClick={onClose} disabled={loading}>×</button>
        <h2>{mode === 'edit' ? 'Editar Ruta' : 'Agregar Nueva Ruta'}</h2>
        
        <form onSubmit={handleSubmit} className="ruta-modal-form">
          <div className="form-group">
            <label htmlFor="numeroRuta">Número de Ruta *</label>
            <input
              id="numeroRuta"
              name="numeroRuta"
              type="text"
              value={form.numeroRuta}
              onChange={handleChange}
              placeholder="Ej: R-001, RUT-001"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="terminalOrigenId">Terminal de Origen *</label>
            <select
              id="terminalOrigenId"
              name="terminalOrigenId"
              value={form.terminalOrigenId}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Seleccione terminal de origen</option>
              {Object.entries(terminalesPorCiudad).map(([ciudad, terminalesCiudad]) => (
                <optgroup key={ciudad} label={ciudad}>
                  {terminalesCiudad.map(terminal => (
                    <option key={terminal.id} value={terminal.id}>
                      {terminal.nombre} - {terminal.direccion}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="terminalDestinoId">Terminal de Destino *</label>
            <select
              id="terminalDestinoId"
              name="terminalDestinoId"
              value={form.terminalDestinoId}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Seleccione terminal de destino</option>
              {Object.entries(terminalesPorCiudad).map(([ciudad, terminalesCiudad]) => (
                <optgroup key={ciudad} label={ciudad}>
                  {terminalesCiudad.map(terminal => (
                    <option key={terminal.id} value={terminal.id}>
                      {terminal.nombre} - {terminal.direccion}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="horaSalida">Hora de Salida *</label>
              <input
                id="horaSalida"
                name="horaSalida"
                type="time"
                value={form.horaSalida}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="horaLlegada">Hora de Llegada *</label>
              <input
                id="horaLlegada"
                name="horaLlegada"
                type="time"
                value={form.horaLlegada}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="ruta-modal-btns">
            <button 
              type="button" 
              className="ruta-modal-cancel" 
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="ruta-modal-save"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (mode === 'edit' ? 'Actualizar Ruta' : 'Crear Ruta')}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Error */}
      {showErrorModal && (
        <SimpleErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default RutaModal;