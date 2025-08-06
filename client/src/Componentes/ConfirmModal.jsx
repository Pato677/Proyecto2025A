import React from 'react';
import './Estilos/Modal.css';
import Button from './Button';

function ConfirmModal({ open, title, children, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ marginBottom: '1.2rem', fontWeight: 600 }}>{title}</h3>
        {children}
        <div className="modal-actions">
          <Button text="Cancelar" width="120px" onClick={onCancel} />
          <Button text="Eliminar" width="120px" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;