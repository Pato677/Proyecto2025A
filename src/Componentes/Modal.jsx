import React from 'react';
import Button from './Button';
import './Estilos/Modal.css';
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <Button text="Cerrar" width="120px" onClick={onClose} />
      </div>
    </div>
  );
}

export default Modal;