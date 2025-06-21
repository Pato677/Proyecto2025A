import React, { useState } from 'react';
import './Estilos/PasajerosMenu.css';

const categorias = [
  { label: 'Pasajero', desc: 'Desde 12 años', min: 1 },
  { label: 'Niños', desc: 'De 1 a 12 años', min: 0 },
  { label: 'Bebés', desc: 'Menores de 1 años', min: 0 },
];

const PasajerosMenu = ({ valores, setValores, onConfirmar }) => {
  const handleChange = (idx, delta) => {
    setValores(valores =>
      valores.map((v, i) =>
        i === idx
          ? Math.max(categorias[i].min, v + delta)
          : v
      )
    );
  };

  return (
    <div className="pasajeros-menu" onClick={e => e.stopPropagation()}>
      <div className="pasajeros-title">¿Quiénes viajan?</div>
      {categorias.map((cat, idx) => (
        <div className="pasajero-row" key={cat.label}>
          <div>
            <div className="pasajero-label">{cat.label}</div>
            <div className="pasajero-desc">{cat.desc}</div>
          </div>
          <div className="pasajero-controls">
            <button
              className="pasajero-btn"
              onClick={() => handleChange(idx, -1)}
              disabled={valores[idx] <= cat.min}
            >−</button>
            <span className="pasajero-cantidad">{valores[idx]}</span>
            <button
              className="pasajero-btn"
              onClick={() => handleChange(idx, 1)}
            >+</button>
          </div>
        </div>
      ))}
      <button className="pasajeros-confirmar" onClick={onConfirmar}>Confirmar</button>
      <div className="pasajeros-info">
        <span className="pasajeros-info-icon">i</span>
        <a href="#" className="pasajeros-info-link">Conoce</a> la política para jóvenes.
      </div>
    </div>
  );
};

export default PasajerosMenu;