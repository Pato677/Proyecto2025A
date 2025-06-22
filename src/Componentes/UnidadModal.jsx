import React, { useState } from 'react';
import './Estilos/UnidadModal.css';

const initialState = {
  placa: '',
  numeroUnidad: '',
  conductor: '',
  controlador: '',
  pisos: '',
  asientos: '',
  imagen: ''
};

const UnidadModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState(initialState);
  const [errores, setErrores] = useState({});

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
    if (!form.conductor) {
      errs.conductor = 'Ingrese el nombre del conductor';
    }
    if (!form.controlador) {
      errs.controlador = 'Ingrese el nombre del controlador';
    }
    if (!form.pisos || isNaN(form.pisos)) {
      errs.pisos = 'Ingrese el número de pisos';
    }
    if (!form.asientos || isNaN(form.asientos)) {
      errs.asientos = 'Ingrese el número de asientos';
    }
    if (!form.imagen) {
      errs.imagen = 'Ingrese la URL o path de la imagen';
    }

    setErrores(errs);

    if (Object.keys(errs).length === 0) {
      onSave(form);
      setForm(initialState);
      setErrores({});
    }
  };

  return (
    <div className="modal-unidad-overlay">
      <div className="modal-unidad">
        <h2>Agregar Unidad</h2>
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
            <input
              name="conductor"
              type="text"
              value={form.conductor}
              onChange={handleChange}
              placeholder="Nombre del conductor"
            />
            {errores.conductor && <span className="error">{errores.conductor}</span>}
          </label>
          <label>
            Controlador*
            <input
              name="controlador"
              type="text"
              value={form.controlador}
              onChange={handleChange}
              placeholder="Nombre del controlador"
            />
            {errores.controlador && <span className="error">{errores.controlador}</span>}
          </label>
          <label>
            N° de pisos*
            <input
              name="pisos"
              type="number"
              min={1}
              value={form.pisos}
              onChange={handleChange}
              placeholder="Ej: 2"
            />
            {errores.pisos && <span className="error">{errores.pisos}</span>}
          </label>
          <label>
            Nro de asientos*
            <input
              name="asientos"
              type="number"
              min={1}
              value={form.asientos}
              onChange={handleChange}
              placeholder="Ej: 54"
            />
            {errores.asientos && <span className="error">{errores.asientos}</span>}
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