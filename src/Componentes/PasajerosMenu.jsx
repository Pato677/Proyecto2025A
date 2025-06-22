import React, { useState } from 'react';
import './Estilos/PasajerosMenu.css';

const categorias = [
  { label: 'Pasajero', desc: 'Desde 12 años', min: 1 },
  { label: 'Niños', desc: 'De 1 a 12 años', min: 0 },
  { label: 'Bebés', desc: 'Menores de 1 años', min: 0 },
];

const PasajerosMenu = ({ valores, setValores, onConfirmar }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

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
        <button
          type="button"
          className="pasajeros-info-link"
          onClick={e => {
            e.preventDefault();
            setMostrarModal(true);
          }}
        >
          Conoce
        </button>
        la política para niños.
      </div>
      {mostrarModal && (
        <div className="pasajeros-modal-overlay">
          <div className="pasajeros-modal">
            <div className="pasajeros-modal-title">Política para niños</div>
            <div className="pasajeros-modal-text">
              Los niños que no puedan ir cargados en brazos deberán pagar su propio asiento.
            </div>
            <button
              className="pasajeros-modal-confirmar"
              onClick={() => setMostrarModal(false)}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasajerosMenu;