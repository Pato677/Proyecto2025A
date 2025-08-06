import React from 'react';
import '../Estilos/TicketInfo.css';

function TicketInfoBoleto({ datosViaje}) {
  // Formatear fecha para mostrar
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div className="ticket-info">
      <h2 className="titulo-itinerario">ITINERARIO</h2>
      <div className="info-grid">
        <div className="info-item-1">
          <div className="info-item"><strong>Cooperativa:</strong> {datosViaje.cooperativa}</div>
          <div className="info-item"><strong>Viaje:</strong> {datosViaje.origen}-{datosViaje.destino} {datosViaje.horaSalida} a {datosViaje.horaLlegada}</div>
        </div>
        <div className="info-item-2">
          <div className="info-item"><strong>Bus N°:</strong> {datosViaje.busNumero}</div>
          <div className="info-item"><strong>Fecha de viaje:</strong> {formatearFecha(datosViaje.fecha) || 'N/A'}</div>      
        </div>
      </div>
    </div>
  );
}

export default TicketInfoBoleto;

