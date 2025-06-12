import React from 'react';
import './Estilos/button.css';

function Button({ text, width = 'auto' }) {
  return (
    <button className="custom-button" style={{ width }}>
      {text}
    </button>
  );
}

export default Button;

