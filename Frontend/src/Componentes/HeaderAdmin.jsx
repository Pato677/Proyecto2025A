import React from 'react';
import logo from './Imagenes/Logo.png';
import { FiGlobe, FiUser } from 'react-icons/fi';
import './Estilos/Admin.css';

const HeaderAdmin = () => (
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
      <div className="header-admin__option">
        <FiUser className="header-admin__icon user" />
        <span>Administrador</span>
      </div>
    </div>
  </header>
);

export default HeaderAdmin;