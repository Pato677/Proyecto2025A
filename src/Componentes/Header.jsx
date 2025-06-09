import React from 'react';
import './Estilos/styles.css';

function Header({ showStep = false }) {
  return (
    <header className="header">
      <div className="header-left">
        <img src="https://i.imgur.com/MpM2YN2.png" alt="Logo" className="logo" />
        <span className="title">Transportes EC</span>
      </div>

      {showStep && (
        <div className="step-indicator">
          <span>Paso 5 de 5</span>
          <div className="progress-bar"></div>
        </div>
      )}

      <div className="top-options">
        <span role="img" aria-label="search">🔍</span> AB4M3
        <span className="separator">|</span>
        <span role="img" aria-label="globe">🌐</span> Español
        <span className="separator">|</span>
        <span role="img" aria-label="user">👤</span> Iniciar Sesión
      </div>
    </header>
  );
}

export default Header;
