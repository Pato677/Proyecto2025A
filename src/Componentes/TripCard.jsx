import React from "react";
import "./Estilos/TripCard.css";

const TripCard = () => {
  return (
    <div className="tripcard-container">
      <div className="tripcard-left">
        <div className="tripcard-row">
          <div className="tripcard-hour">
            <span className="hour-big">13:30</span>
            <span className="city">Quito</span>
          </div>
          <div className="tripcard-line">
            <div className="tripcard-dot"></div>
            <div className="tripcard-bar"></div>
            <div className="tripcard-dot"></div>
          </div>
          <div className="tripcard-hour">
            <span className="hour-big">21:30</span>
            <span className="city city-bold">Guayaquil</span>
          </div>
        </div>
        <div className="tripcard-info">
          <span className="company">Velotax</span>
          <span className="time-info">Tiempo de Viaje: 8 horas</span>
        </div>
      </div>
      <div className="tripcard-pricepill">
        <div className="pill-content">
          <span className="pill-usd">USD</span>
          <span className="pill-price">12.25</span>
          
        </div>
        <div className="pill-arrow">
          <span className="pill-arro">&#9660;</span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
