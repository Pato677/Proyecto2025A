import React from 'react';
import './Estilos/WarningModal.css'; // Reutilizamos los estilos
import Button from './Button';

const InfoModal = ({ open, onClose, title, message, icon }) => {
  if (!open) return null;

  return (
    <div className="warning-modal-overlay" onClick={onClose}>
      <div className="warning-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="warning-modal-header">
          <div className="warning-icon">
            {icon || (
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <circle 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="#3077c6" 
                  strokeWidth="2" 
                  fill="none"
                />
                <path 
                  d="M12 16v-4M12 8h.01" 
                  stroke="#3077c6" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <h3 className="warning-title" style={{ color: '#3077c6' }}>
            {title || 'Información'}
          </h3>
        </div>
        
        <div className="warning-content">
          <p>{message}</p>
        </div>
        
        <div className="warning-actions">
          <Button
            text="Entendido"
            width="130px"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default InfoModal;