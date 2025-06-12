import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import '../Estilos/Ticket.css';
import Button from '../Button';

function TicketPage() {
  return (
    <div className="ticket-page">
      <Header currentStep={5} totalSteps={5} />
      <main className="ticket-main">
        <h1 className="ticket-main-title">
          Boleto: <span className="ticket-code">AB4M3</span>
        </h1>
        <section className="ticket-itinerary">
          <div className="ticket-itinerary-title">ITINERARIO</div>
          <div className="ticket-itinerary-divider"></div>
          <div className="ticket-itinerary-details">
            <div>
              <b>Cooperativa:</b> Transportes Ecuador
            </div>
            <div>
              <b>Viaje:</b> Quito-Guayaquil 13:30 a 21:30
            </div>
            <div>
              <b>Bus N°:</b> 11
            </div>
            <div>
              <b>Asiento:</b> 1B
            </div>
            <div>
              <b>Andén:</b> 11
            </div>
            <div>
              <b>Fecha de viaje:</b> 27/05/2025
            </div>
          </div>
        </section>
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
          <Button text="Atras" width='150px'/>
          <Button text="Imprimir" width='150px'/>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TicketPage;