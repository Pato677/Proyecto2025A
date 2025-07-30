import React, { useState } from 'react';
import './Estilos/styles.css';
import Logo from './Imagenes/Logo.png';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaUser } from 'react-icons/fa';

function Header({
  showSearch = true,
  showLanguage = true,
  showUser = true,
  onLoginClick = null,
  onPerfilClick = null,
  userLabel = "Iniciar Sesión",
  currentStep = 1,
  totalSteps = 5,
  usuario = null,
  onLogout = () => {}
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleUserAction = () => {
    if (usuario) return;
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate("/login");
    }
  };

  const handlePerfilClick = () => {
    if (onPerfilClick) {
      onPerfilClick();
    } else {
      navigate('/PerfilUsuario');
    }
    setMenuOpen(false);
  };

  const progressPercent = Math.max(0, Math.min(100, ((currentStep - 1) / (totalSteps - 1)) * 100));

  return (
    <header className="ticket-header">
      <img
        src={Logo}
        alt="Logo"
        className="ticket-logo"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/Inicio')}
      />

      {showSearch && (
        <div className="ticket-step-indicator">
          <span>Paso {currentStep} de {totalSteps}</span>
          <div className="ticket-progress-bar">
            <div
              className="ticket-progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="ticket-top-options">
        {showLanguage && (
          <>
            <FaGlobe className="ticket-icon" />
            <span>Español</span>
            <span className="ticket-separator">|</span>
          </>
        )}

        {showUser && (
          usuario ? (
            <div
              className="user-dropdown"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <FaUser className="ticket-icon" />
              <span className="ticket-login">
                {usuario.nombres ? usuario.nombres.split(' ')[0] : 
                 usuario.correo ? usuario.correo.split('@')[0] : 
                 'Usuario'} 
              </span>
              {menuOpen && (
                <div className="dropdown-content">
                  <div onClick={handlePerfilClick}>Mi perfil</div>
                  <div onClick={onLogout}>Cerrar sesión</div>
                </div>
              )}
            </div>
          ) : (
            <div className="login-area">
              <FaUser className="ticket-icon" />
              <span 
                className="ticket-login"
                onClick={handleUserAction}
                style={{ cursor: 'pointer' }}
              >
                {userLabel}
              </span>
            </div>
          )
        )}
      </div>
    </header>
  );
}

export default Header;
