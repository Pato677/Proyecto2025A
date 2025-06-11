import React from 'react';

function Button({ text, icon, onClick}) {
  return (
    <button className="custom-button" >
      {icon && <span className="button-icon">{icon}</span>}
      <span>{text}</span>
    </button>
  );
}

export default Button;
