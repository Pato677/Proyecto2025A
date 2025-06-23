import React from 'react';
import './Estilos/styles.css';
import Logo from './Imagenes/Logo.png';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaUser } from 'react-icons/fa'; // Íconos agregados

function Header({
    showSearch = true,
    showLanguage = true,
    showUser = true,
    onLoginClick = null,
    userLabel = "Iniciar Sesión",
    currentStep = 1,
    totalSteps = 5,
    usuario = null,
    onLogout = () => {}
}) {
    const navigate = useNavigate();

    const handleUserAction = () => {
        if (usuario) return;
        if (onLoginClick) {
            onLoginClick();
        } else {
            navigate("/login");
        }
    };

    const handlePerfilClick = () => {
        navigate('/perfil');
    };

    const progressPercent = Math.max(0, Math.min(100, ((currentStep - 1) / (totalSteps - 1)) * 100));

    return (
        <header className="ticket-header">
            <img src={Logo} alt="Logo" className="ticket-logo" />
            
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
                        <FaGlobe className="ticket-icon" /> Español
                        <span className="ticket-separator">|</span>
                    </>
                )}

                {showUser && (
                    usuario ? (
                        <div className="user-dropdown">
                            <FaUser className="ticket-icon" />
                            <span 
                                className="ticket-login"
                                onClick={handleUserAction}
                            >
                                {usuario.nombres.split(' ')[0]} ?
                            </span>
                            <div className="dropdown-content">
                                <div onClick={handlePerfilClick}>Mi perfil</div>
                                <div onClick={onLogout}>Cerrar sesión</div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <FaUser className="ticket-icon" />
                            <span 
                                className="ticket-login" 
                                onClick={handleUserAction}
                                style={{ cursor: 'pointer' }}
                            >
                                {userLabel}
                            </span>
                        </>
                    )
                )}
            </div>
        </header>
    );
}

export default Header;
