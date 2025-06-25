import React from 'react';
import Footer from './Footer';
import Maps from './Imagenes/Maps.png';
import Button from './Button';
import { FaSearch, FaGlobe, FaUserCircle } from "react-icons/fa";
import './Estilos/LiveLocation.css';

function LiveLocationHeader() {
  return (
    <header className="live-header">
      <div className="live-header-left">
        <img src={require('./Imagenes/Logo.png')} alt="Logo" className="live-logo" />
        <span className="live-title">Transportes EC</span>
      </div>
      <div className="live-header-right">
        <div className="live-search">
          <FaSearch className="live-search-icon" />
        </div>
        <span className="live-ticket-code">AB4M3</span>
        <span className="live-separator">|</span>
        <FaGlobe className="live-globe" />
        <span className="live-language">Español</span>
        <span className="live-separator">|</span>
        <FaUserCircle className="live-user" />
        <span className="live-user-label">Iniciar Sesión</span>
      </div>
    </header>
  );
}

function LiveLocationPage() {
  return (
    <div className="ticket-page">
      <LiveLocationHeader />
      <main className="live-main-content">
        <h1 className="live-title-main">Ubicación en Tiempo Real</h1>
        <p className="live-estimated-time">Hora de llegada aproximada: 21:35</p>
        <div className="live-map-container">
          <img
            src={Maps}
            alt="Mapa en tiempo real"
            className="live-map-image"
          />
        </div>
        <div className="live-button-group">
          <div className="btnCompartir">
            <Button  text="Compartir Ubicación" />

          </div>
          <div className="btnAtras">
            <Button  text="Atras" />

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LiveLocationPage;