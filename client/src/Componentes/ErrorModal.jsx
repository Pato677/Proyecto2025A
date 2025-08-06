import React from 'react';
import './Estilos/ErrorModal.css';
import { X } from 'lucide-react';

const ErrorModal = ({ errores, cerrar }) => {
  if (!errores || errores.length === 0) return null;

  return (
    <div className="modal-overlay">
      <div className="error-modal">
        <div className="error-modal-header">
          <h3>Errores de validación</h3>
          <button className="close-btn" onClick={cerrar}>
            <X size={24} />
          </button>
        </div>
        <div className="error-modal-content">
          <ul className="error-list">
            {errores.map((error, index) => (
              <li key={index} className="error-item">
                <strong>Pasajero {error.pasajero}:</strong> {error.mensaje}
              </li>
            ))}
          </ul>
        </div>
        <div className="error-modal-footer">
          <button className="btn-cerrar" onClick={cerrar}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
