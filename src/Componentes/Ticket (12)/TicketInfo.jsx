import React from 'react';

function TicketInfo() {
  return (
    <div className="ticket-info">
      <h2>ITINERARIO</h2>
      <div className="info-grid">
        <div><strong>Cooperativa:</strong> Transportes Ecuador</div>
        <div><strong>Viaje:</strong> Quito-Guayaquil 13:30 a 21:30</div>
        <div><strong>Bus N°:</strong> 11</div>
        <div><strong>Asiento:</strong> 1B</div>
        <div><strong>Andén:</strong> 11</div>
        <div><strong>Fecha de viaje:</strong> 27/05/2025</div>
      </div>
    </div>
  );
}

export default TicketInfo;
