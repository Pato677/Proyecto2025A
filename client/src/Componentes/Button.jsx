import React from 'react';
import './Estilos/button.css';

function Button({ text, width = 'auto', onClick, disabled = false }) {
  return (
    <button 
      className="custom-button" 
      style={{ width }} 
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;

