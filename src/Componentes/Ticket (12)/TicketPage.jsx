import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import TicketInfo from './TicketInfo';
import '../Estilos/Ticket.css';

function TicketPage() {
  return (
    <div className="ticket-page">
      <Header currentStep={5} totalSteps={5} />
      <main className="ticket-main">
        <h1 className="ticket-main-title">
          Boleto: <span className="ticket-code">AB4M3</span>
        </h1>
        
       <div className="ticket-info-box">
            <TicketInfo/>

        </div>

        <div className="ticket-qr-section">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=AB4M3"
            alt="QR Code"
            className="ticket-qr"
          />
        </div>
        <p className="ticket-instructions">
          Presente este código como su boleto para ingresar en la unidad de transporte.<br />
          Obtendrá una copia del mismo directamente a su correo electrónico.
        </p>
        <div className="ticket-button-group">
          <button className="ticket-btn ticket-btn-back">
            <b>ATRÁS</b>
          </button>
          <button className="ticket-btn ticket-btn-print">
            <span role="img" aria-label="printer" className="ticket-btn-icon">
              🖨️
            </span>
            <b>IMPRIMIR</b>
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TicketPage;