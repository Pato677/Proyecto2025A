import React from 'react';
import { FiX } from 'react-icons/fi';
import { FaBus } from 'react-icons/fa';
import './Estilos/Admin.css'; 

const stops = [
  'Tambillo',
  'Aloag',
  'Santo Domingo',
  'Quevedo',
  'Babahoyo',
  'Jujan',
  'Guayaquil'
];

const ParadasModal = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal">
      <button className="modal-close" onClick={onClose}>
        <FiX />
      </button>

      <div className="modal-icon-wrapper">
        <div className="modal-icon">
          <FaBus />
        </div>
      </div>

      <h2 className="modal-title">Paradas</h2>

      <ul className="modal-list">
        {stops.map((parada, i) => (
          <li key={i}>{parada}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default ParadasModal;
