import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from './Imagenes/Logo.png';
import { FiGlobe, FiUser, FiChevronDown, FiSettings, FiLogOut } from 'react-icons/fi';
import './Estilos/Admin.css';

const HeaderAdmin = ({ onPerfilClick }) => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Obtener el nombre a mostrar según el rol del usuario
  const getNombreUsuario = () => {
    if (!usuario) return 'Usuario';
    
    if (usuario.rol === 'cooperativa') {
      return usuario.razonSocial || usuario.UsuarioCooperativa?.razon_social || 'Cooperativa';
    } else if (usuario.rol === 'final') {
      const nombre = usuario.nombreCompleto || 
                    (usuario.nombres && usuario.apellidos ? 
                     `${usuario.nombres} ${usuario.apellidos}` : 
                     (usuario.UsuarioFinal ? 
                      `${usuario.UsuarioFinal.nombres} ${usuario.UsuarioFinal.apellidos}` : 
                      'Usuario'));
      return nombre;
    } else if (usuario.rol === 'superuser') {
      const nombre = usuario.nombreCompleto || 
                    (usuario.nombres && usuario.apellidos ? 
                     `${usuario.nombres} ${usuario.apellidos}` : 
                     (usuario.UsuarioFinal ? 
                      `${usuario.UsuarioFinal.nombres} ${usuario.UsuarioFinal.apellidos}` : 
                      'Superuser'));
      return nombre;
    }
    
    return 'Usuario';
  };

  const handlePerfilClick = () => {
    setShowDropdown(false);
    
    // Bloquear acceso al perfil para superusers
    if (usuario && usuario.rol === 'superuser') {
      alert('⚠️ El perfil del Superadministrador está protegido y no puede ser modificado por seguridad.');
      return;
    }
    
    if (onPerfilClick) {
      onPerfilClick();
    } else {
      navigate('/PerfilUsuario');
    }
  };

  const handleLogoutClick = () => {
    setShowDropdown(false);
    logout();
    navigate('/Inicio');
  };

  return (
    <header className="header-admin">
      <div className="header-admin__left">
        <img src={logo} alt="Transportes EC" className="header-admin__logo" />
        <span className="header-admin__brand">Transportes EC</span>
      </div>
      <div className="header-admin__right">
        <div className="header-admin__option">
          <FiGlobe className="header-admin__icon" />
          <span>Español</span>
        </div>
        <span className="header-admin__divider">|</span>
        <div className="header-admin__user-menu" ref={dropdownRef}>
          <div 
            className="header-admin__option header-admin__user-toggle"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FiUser className="header-admin__icon user" />
            <span>{getNombreUsuario()}</span>
            <FiChevronDown className={`header-admin__chevron ${showDropdown ? 'rotated' : ''}`} />
          </div>
          
          {showDropdown && (
            <div className="header-admin__dropdown">
              <div 
                className={`header-admin__dropdown-item ${usuario && usuario.rol === 'superuser' ? 'disabled' : ''}`} 
                onClick={handlePerfilClick}
                title={usuario && usuario.rol === 'superuser' ? 'Perfil protegido por seguridad' : 'Ver mi perfil'}
              >
                <FiSettings className="header-admin__dropdown-icon" />
                <span>Mi Perfil</span>
                {usuario && usuario.rol === 'superuser' && <span className="locked-indicator">🔒</span>}
              </div>
              <div className="header-admin__dropdown-item" onClick={handleLogoutClick}>
                <FiLogOut className="header-admin__dropdown-icon" />
                <span>Cerrar Sesión</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;