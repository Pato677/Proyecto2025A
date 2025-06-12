import React from 'react';
import './Estilos/styles.css';
import Logo from './Imagenes/Logo.png';
import { FaSearch, FaGlobe, FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Header({
    showSearch = true,
    showLanguage = true,
    showUser = true,
    onLoginClick = null,
    userLabel = "Iniciar Sesión"
}) {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        if (onLoginClick) {
            onLoginClick();
        } else {
            navigate("/login");
        }
    };

     return (
    <header className="ticket-header">
      <img src={Logo} alt="Logo" className="ticket-logo" />
      <span className="ticket-title">Transportes EC</span>
      <div className="ticket-step-indicator">
        <span>Paso 5 de 5</span>
        <div className="ticket-progress-bar">
          <div className="ticket-progress-bar-fill"></div>
        </div>
      </div>
      <div className="ticket-top-options">
        <span role="img" aria-label="globe" className="ticket-globe">🌐</span> Español
        <span className="ticket-separator">|</span>
        <span role="img" aria-label="user" className="ticket-user">🔵</span> Iniciar Sesión
      </div>
    </header>
  );
}

export default Header;
