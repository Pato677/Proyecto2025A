import React from 'react';
import './Estilos/Admin.css'; 

const ActionButtons = ({ onAdd, onDelete, onUpdate }) => (
  <div className="action-buttons">
    <button className="btn-outline" onClick={onAdd}>
      Agregar
    </button>
    <button className="btn-outline" onClick={onDelete}>
      Eliminar
    </button>
    <button className="btn-outline" onClick={onUpdate}>
      Actualizar
    </button>
  </div>
);

export default ActionButtons;
