import React from "react";
import "./Estilos/TripCard.css";

const TripCard = ({ horaSalida, horaLlegada, empresa, precio }) => {
  return (
    <div className="tripcard-container">
      <div className="tripcard-left">
        <div className="tripcard-row">
          <div className="tripcard-hour">
            <span className="hour-big">{horaSalida}</span>
            <span className="city">Quito</span>
          </div>
          <div className="tripcard-line">
            <div className="tripcard-dot"></div>
            <div className="tripcard-bar"></div>
            <div className="tripcard-dot"></div>
          </div>
          <div className="tripcard-hour">
            <span className="hour-big">{horaLlegada}</span>
            <span className="city city-bold">Guayaquil</span>
          </div>
        </div>
        <div className="tripcard-info">
          <span className="company">{empresa}</span>
          <span className="time-info">
            {/* Si tienes el tiempo de viaje, pásalo como prop, si no, puedes calcularlo aquí */}
            {/* Ejemplo: */} Tiempo de Viaje: {/* ... */}
          </span>
        </div>
      </div>
      <div className="tripcard-pricepill">
        <div className="pill-content">
          <span className="pill-usd">USD</span>
          <span className="pill-price">{precio}</span>
        </div>
        <div className="pill-arrow">
          <span className="pill-arro">&#9660;</span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
