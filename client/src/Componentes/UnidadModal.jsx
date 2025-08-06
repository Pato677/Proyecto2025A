import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Estilos/UnidadModal.css';

const initialState = {
  placa: '',
  numeroUnidad: '',
  conductor_id: '',
  controlador_id: '',
  imagen: ''
};

const UnidadModal = ({ open, onClose, onSave, initialData, mode }) => {
  const [form, setForm] = useState(initialData || initialState);
  const [errores, setErrores] = useState({});
  const [conductores, setConductores] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/conductores')
      .then(res => setConductores(res.data))
      .catch(() => setConductores([]));
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        conductor_id: initialData.conductor_id || '',
        controlador_id: initialData.controlador_id || ''
      });
    } else {
      setForm(initialState);
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "placa" ? value.toUpperCase() : value
    }));
  };

  const validarPlaca = placa => /^[A-Z]{3}[0-9]{4}$/.test(placa);

  const handleSubmit = e => {
    e.preventDefault();
    let errs = {};

    if (!form.placa || !validarPlaca(form.placa)) {
      errs.placa = 'Placa en formato XXX1234';
    }
    if (!form.numeroUnidad || isNaN(form.numeroUnidad)) {
      errs.numeroUnidad = 'Ingrese un número de unidad válido';
    }
    if (!form.conductor_id) {
      errs.conductor_id = 'Seleccione un conductor';
    }
    if (!form.controlador_id) {
      errs.controlador_id = 'Seleccione un controlador';
    }
    if (!form.imagen) {
      errs.imagen = 'Ingrese la URL o path de la imagen';
    }

    setErrores(errs);

    if (Object.keys(errs).length === 0) {
      onSave({
        ...form,
        numeroUnidad: Number(form.numeroUnidad),
        conductor_id: Number(form.conductor_id),
        controlador_id: Number(form.controlador_id)
      });
      setForm(initialState);
      setErrores({});
    }
  };

  return (
    <div className="modal-unidad-overlay">
      <div className="modal-unidad">
        <h2>{mode === 'edit' ? 'Actualizar Unidad' : 'Agregar Unidad'}</h2>
        <form onSubmit={handleSubmit} className="modal-unidad-form">
          <label>
            Placa*
            <input
              name="placa"
              type="text"
              maxLength={7}
              value={form.placa}
              onChange={handleChange}
              placeholder="Ej: ABC1234"
            />
            {errores.placa && <span className="error">{errores.placa}</span>}
          </label>
          <label>
            N° de unidad*
            <input
              name="numeroUnidad"
              type="number"
              value={form.numeroUnidad}
              onChange={handleChange}
              placeholder="Ej: 25"
            />
            {errores.numeroUnidad && <span className="error">{errores.numeroUnidad}</span>}
          </label>

          <label>
            Conductor*
            <select name="conductor_id" value={form.conductor_id} onChange={handleChange}>
              <option value="">Seleccione un conductor</option>
              {conductores.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {errores.conductor_id && <span className="error">{errores.conductor_id}</span>}
          </label>

          <label>
            Controlador*
            <select name="controlador_id" value={form.controlador_id} onChange={handleChange}>
              <option value="">Seleccione un controlador</option>
              {conductores.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {errores.controlador_id && <span className="error">{errores.controlador_id}</span>}
          </label>

          <label>
            Imagen (URL o path)*
            <input
              name="imagen"
              type="text"
              value={form.imagen}
              onChange={handleChange}
              placeholder="https://..."
            />
            {errores.imagen && <span className="error">{errores.imagen}</span>}
          </label>
          <div className="modal-unidad-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnidadModal;
