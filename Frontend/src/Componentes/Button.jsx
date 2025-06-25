import React from 'react';
import './Estilos/button.css';

function Button({ text, width = 'auto', onClick }) {
  return (
    <button className="custom-button" style={{ width }} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;

