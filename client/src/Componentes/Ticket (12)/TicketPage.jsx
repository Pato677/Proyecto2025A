import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import TicketInfo from './TicketInfo';
import '../Estilos/Ticket.css';
import Button from '../Button';

function TicketPage() {
  const [searchParams] = useSearchParams();
  const compraId = searchParams.get('compraId') || 'N/A';

  return (
    <div className="ticket-page">
      <Header currentStep={5} totalSteps={5} />
      <main className="ticket-main">
        <h1 className="ticket-main-title">
          Compra ID: <span className="ticket-code">{compraId}</span>
        </h1>
        
       <div className="ticket-info-box">
            <TicketInfo/>

        </div>

        <div className="ticket-qr-section">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${compraId}`}
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