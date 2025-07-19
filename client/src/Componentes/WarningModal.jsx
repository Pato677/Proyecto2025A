import React from 'react';
import './Estilos/WarningModal.css';
import Button from './Button';

const WarningModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="warning-modal-overlay" onClick={onClose}>
      <div className="warning-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="warning-modal-header">
          <div className="warning-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
                stroke="#f39c12"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 15.75h.007v.008H12v-.008z"
                stroke="#f39c12"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="warning-title">Advertencia</h3>
        </div>
        
        <div className="warning-content">
          <p>
            El tiempo estimado de llegada puede variar debido a condiciones del tráfico, 
            clima u otros factores externos.
          </p>
        </div>
        
        <div className="warning-actions">
          <Button
            text="Cancelar"
            width="130px"
            onClick={onClose}
          />
          <Button
            text="Continuar"
            width="130px"
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default WarningModal;