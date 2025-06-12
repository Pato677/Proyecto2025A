import React from 'react';
import './Estilos/styles.css';
import Logo from './Imagenes/Logo.png';
import { useNavigate } from 'react-router-dom';

function Header({
    showSearch = true,
    showLanguage = true,
    showUser = true,
    onLoginClick = null,
    userLabel = "Iniciar Sesión",
    currentStep = 1,
    totalSteps = 5
}) {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        if (onLoginClick) {
            onLoginClick();
        } else {
            navigate("/login");
        }
    };

    // Calcula el porcentaje para la barra de progreso
    const progressPercent = Math.max(0, Math.min(100, ((currentStep - 1) / (totalSteps - 1)) * 100));

    return (
        <header className="ticket-header">
            <img src={Logo} alt="Logo" className="ticket-logo" />
            
            <div className="ticket-step-indicator">
                <span>Paso {currentStep} de {totalSteps}</span>
                <div className="ticket-progress-bar">
                    <div
                        className="ticket-progress-bar-fill"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>
            <div className="ticket-top-options">
                <span role="img" aria-label="globe" className="ticket-globe">🌐</span> Español
                <span className="ticket-separator">|</span>
                <span role="img" aria-label="user" className="ticket-user">🔵</span>
                <span className="ticket-login" onClick={handleLoginClick} style={{ cursor: 'pointer' }}>{userLabel}</span>
            </div>
        </header>
    );
}

export default Header;
