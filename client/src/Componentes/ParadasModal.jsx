import React from 'react';
import { FiX } from 'react-icons/fi';
import { FaBus } from 'react-icons/fa';
import './Estilos/ParadasModal.css'; 

const ParadasModal = ({ onClose, ruta }) => {
  const paradas = Array.isArray(ruta?.paradas) ? ruta.paradas : [];

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

        <h2 className="modal-title">Paradas de la Ruta {ruta?.numeroRuta || ruta?.numero_ruta}</h2>
        
        <div className="route-info">
          <p><strong>Origen:</strong> {ruta?.ciudadOrigen} - {ruta?.terminalOrigen}</p>
          <p><strong>Destino:</strong> {ruta?.ciudadDestino} - {ruta?.terminalDestino}</p>
          <p><strong>Horario:</strong> {ruta?.horaSalida} - {ruta?.horaLlegada}</p>
        </div>

        <div className="paradas-list-container">
          {paradas.length > 0 ? (
            <ul className="modal-list">
              {paradas.map((parada, i) => (
                <li key={i} className="parada-item">
                  <span className="parada-number">{i + 1}</span>
                  <div className="parada-details">
                    <span className="parada-name">{parada.nombre || parada}</span>
                    {parada.ciudad && (
                      <small className="parada-info">
                        {parada.ciudad} {parada.direccion && `- ${parada.direccion}`}
                      </small>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-paradas">
              <p>No hay paradas registradas para esta ruta</p>
              <small>Use el botón de editar (🗺️) para agregar paradas en el mapa</small>
            </div>
          )}
        </div>
        
        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParadasModal;
