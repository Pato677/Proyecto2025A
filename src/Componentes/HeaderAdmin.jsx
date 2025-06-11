import React from 'react';
import logo from './Imagenes/Logo.png'; // Asegúrate de que la ruta sea correcta
import { FiGlobe, FiUser } from 'react-icons/fi';
import './Estilos/Admin.css'; 

const HeaderAdmin = () => (
  <header className="header-admin">
    <div className="header-admin__left">
      <img src={logo} alt="Transportes EC" className="header-admin__logo" />
      <span className="header-admin__brand">Transportes EC</span>
    </div>
    <div className="header-admin__right">
      <button className="header-admin__btn">
        <FiGlobe /> Español
      </button>
      <button className="header-admin__btn">
        <FiUser /> Administrador
      </button>
    </div>
  </header>
);

export default HeaderAdmin;
