import React from 'react';
import './Estilos/ErrorModal.css';
import { X } from 'lucide-react';

const SimpleErrorModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="modal-overlay">
      <div className="error-modal">
        <div className="error-modal-header">
          <h3>Información</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="error-modal-content">
          <div className="simple-message">
            {message.split('\n').map((line, index) => (
              <p key={index} style={{ margin: '5px 0' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
        <div className="error-modal-footer">
          <button className="btn-cerrar" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleErrorModal;
