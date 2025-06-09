import React from 'react';
import TicketInfo from './TicketInfo';
import QRCode from './QRCode';
import Button from '../Button';

import '../Estilos/styles.css'

function TicketPage() {
  return (
    <div className="ticket-page">
      <header className="header">
        <img src="https://i.imgur.com/MpM2YN2.png" alt="Logo" className="logo" />
        <span className="title">Transportes EC</span>
        <div className="step-indicator">
          <span>Paso 5 de 5</span>
          <div className="progress-bar"></div>
        </div>
        <div className="top-options">
          <span role="img" aria-label="globe">🌐</span> Español
          <span className="separator">|</span>
          <span role="img" aria-label="user">🔵</span> Iniciar Sesión
        </div>
      </header>

      <main className="main-content">
        <h1>Boleto: AB4M3</h1>
        <TicketInfo />
        <QRCode />
        <p className="instructions">
          Presente este código como su boleto para ingresar en la unidad de transporte.<br />
          Obtendrá una copia del mismo directamente a su correo electrónico.
        </p>
        <div className="button-group">
          <Button text="ATRÁS" />
          <Button text="IMPRIMIR" icon="🖨️" />
        </div>
      </main>

      <footer className="footer">
        © 2025 Todos los derechos reservados.<br />
        Av. Eloy Alfaro y República, Quito, Ecuador &nbsp; | &nbsp;
        contacto@transportesec.com &nbsp; | &nbsp; Tel: +593 2 600 1234
      </footer>
    </div>
  );
}

export default TicketPage;
