import React from 'react';
import './Estilos/Modal.css';

function ConfirmModal({ open, title, children, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        {children}
        <div className="modal-actions">
          <button onClick={onCancel}>
            Cancelar
          </button>
          <button onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;