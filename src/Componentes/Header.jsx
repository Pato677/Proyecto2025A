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
        <header className="header">
            <div className="logo">
                <img src={Logo} alt="Logo" />
            </div>

            <nav className="nav">
                {showSearch && (
                    <div className="nav-item">
                        <FaSearch className="icon" />
                        <span className="link-simulado">Buscar viaje</span>
                    </div>
                )}

                {showLanguage && (
                    <div className="nav-item">
                        <FaGlobe className="icon" />
                        <span>Español</span>
                    </div>
                )}

                {showUser && (
                    <div className="nav-item">
                        <FaUserCircle className="icon" />
                        <button onClick={handleLoginClick}>{userLabel}</button>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;
