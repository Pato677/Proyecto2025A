import React, { useState, useEffect } from 'react';
import './Estilos/RutasModal.css';

const initialState = {
  numeroRuta: '',
  ciudadOrigen: '',
  terminalOrigen: '',
  ciudadDestino: '',
  terminalDestino: '',
  horaSalida: '',
  horaLlegada: '',
  paradas: '',
};

const RutaModal = ({ open, onClose, onSave, initialData, mode = 'add', terminales}) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm(initialState);
  }, [initialData, open]);

  if (!open) return null;

  // Obtener ciudades únicas
  const ciudades = terminales.map(t => t.ciudad);
  const terminalesOrigen = terminales.find(t => t.ciudad === form.ciudadOrigen)?.terminales || [];
  const terminalesDestino = terminales.find(t => t.ciudad === form.ciudadDestino)?.terminales || [];

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'ciudadOrigen') {
      setForm(prev => ({ ...prev, ciudadOrigen: value, terminalOrigen: '' }));
    } else if (name === 'ciudadDestino') {
      setForm(prev => ({ ...prev, ciudadDestino: value, terminalDestino: '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="ruta-modal-bg">
      <div className="ruta-modal-content">
        <button className="ruta-modal-close" onClick={onClose}>×</button>
        <h2>{mode === 'edit' ? 'Editar Ruta' : 'Agregar Ruta'}</h2>
        <form onSubmit={handleSubmit} className="ruta-modal-form">
          <input
            name="numeroRuta"
            value={form.numeroRuta}
            onChange={handleChange}
            placeholder="Número de Ruta"
            required
          />
          {/* Ciudad Origen */}
          <select
            name="ciudadOrigen"
            value={form.ciudadOrigen}
            onChange={handleChange}
            required
            
          >
            <option value="">Seleccione Ciudad Origen</option>
            {ciudades.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
          {/* Terminal Origen */}
          <select
            name="terminalOrigen"
            value={form.terminalOrigen}
            onChange={handleChange}
            required
            disabled={!form.ciudadOrigen}
          >
            <option value="">Seleccione Terminal Origen</option>
            {terminalesOrigen.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>
          {/* Ciudad Destino */}
          <select
            name="ciudadDestino"
            value={form.ciudadDestino}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione Ciudad Destino</option>
            {ciudades.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
          {/* Terminal Destino */}
          <select
            name="terminalDestino"
            value={form.terminalDestino}
            onChange={handleChange}
            required
            disabled={!form.ciudadDestino}
          >
            <option value="">Seleccione Terminal Destino</option>
            {terminalesDestino.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>
          <input
            name="horaSalida"
            value={form.horaSalida}
            onChange={handleChange}
            placeholder="Hora Salida"
            required
          />
          <input
            name="horaLlegada"
            value={form.horaLlegada}
            onChange={handleChange}
            placeholder="Hora Llegada"
            required
          />
          <input
            name="paradas"
            value={form.paradas}
            onChange={handleChange}
            placeholder="Paradas"
            required
          />
          <div className="ruta-modal-btns">
            <button type="submit" className="ruta-modal-save">
              {mode === 'edit' ? 'Actualizar' : 'Guardar'}
            </button>
            <button type="button" className="ruta-modal-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RutaModal;