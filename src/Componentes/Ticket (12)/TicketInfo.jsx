import React from 'react';
import '../Estilos/TicketInfo.css';

function TicketInfo() {
  return (
    <div className="ticket-info">
      <h2 className="titulo-itinerario">ITINERARIO</h2>
      <div className="info-grid">
        <div className="info-item-1">
          <div className="info-item"><strong>Cooperativa:</strong> Transportes Ecuador</div>
          <div className="info-item"><strong>Viaje:</strong> Quito-Guayaquil 13:30 a 21:30</div>
        </div>
        <div className="info-item-2">
          <div className="info-item"><strong>Bus N°:</strong> 11</div>
          <div className="info-item"><strong>Asiento:</strong> 1B</div>
          <div className="info-item"><strong>Andén:</strong> 11</div>
          <div className="info-item"><strong>Fecha de viaje:</strong> 27/05/2025</div>
        </div>
      </div>
    </div>
  );
}

export default TicketInfo;

