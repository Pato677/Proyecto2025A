import React from 'react';

function Button({ text, icon }) {
  return (
    <button className="custom-button">
      {icon && <span className="button-icon">{icon}</span>}
      <span>{text}</span>
    </button>
  );
}

export default Button;
