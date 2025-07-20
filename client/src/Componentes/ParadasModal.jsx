import React from 'react';
import { FiX } from 'react-icons/fi';
import { FaBus } from 'react-icons/fa';
import './Estilos/ParadasModal.css'; 

const ParadasModal = ({ onClose, ruta }) => {
  const paradas = ruta?.paradas || [];

  return (
    <div className="modal-overlay">
      <div className="paradas-modal">
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>

        <div className="modal-icon-wrapper">
          <div className="modal-icon">
            <FaBus />
          </div>
        </div>

        <h2 className="modal-title">Paradas de la Ruta {ruta?.numeroRuta}</h2>

        <div className="paradas-list-container">
          <ul className="modal-list">
            {paradas.map((parada, i) => (
              <li key={i}>{parada}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParadasModal;
