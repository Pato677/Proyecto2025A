import React from 'react';
import './Estilos/ConfirmacionCompraModal.css';

const ConfirmacionCompraModal = ({ open, onConfirmar, onCancelar, totalPasajeros, precioTotal }) => {
  if (!open) return null;

  return (
    <div className="confirmacion-modal-bg">
      <div className="confirmacion-modal-content">
        <button className="confirmacion-modal-close" onClick={onCancelar}>×</button>
        
        <div className="confirmacion-icon">
          ⚠️
        </div>
        
        <h2 className="confirmacion-title">Confirmar Compra</h2>
        
        <div className="confirmacion-message">
          <p>¿Está seguro de que desea realizar esta compra?</p>
          <div className="confirmacion-details">
            <p><strong>Pasajeros:</strong> {totalPasajeros}</p>
            <p><strong>Total a pagar:</strong> ${precioTotal}</p>
          </div>
          <div className="confirmacion-warning">
            <strong>⚠️ IMPORTANTE:</strong> Una vez confirmada la compra, 
            <strong> no se realizarán devoluciones de dinero</strong> bajo ninguna circunstancia.
          </div>
        </div>

        <div className="confirmacion-modal-btns">
          <button 
            type="button" 
            onClick={onCancelar} 
            className="confirmacion-modal-cancel"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            onClick={onConfirmar} 
            className="confirmacion-modal-confirm"
          >
            Confirmar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionCompraModal;
