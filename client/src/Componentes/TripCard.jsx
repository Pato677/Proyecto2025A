import React from "react";
import "./Estilos/TripCard.css";

function calcularDuracion(horaSalida, horaLlegada) {
  // Formato esperado: "HH:mm"
  const [hs, ms] = horaSalida.split(":").map(Number);
  const [hl, ml] = horaLlegada.split(":").map(Number);

  let inicio = hs * 60 + ms;
  let fin = hl * 60 + ml;

  // Si la llegada es menor que la salida, asume que es al día siguiente
  if (fin < inicio) fin += 24 * 60;

  const duracionMin = fin - inicio;
  const horas = Math.floor(duracionMin / 60);
  const minutos = duracionMin % 60;

  return `${horas}h ${minutos}min`;
}

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
            Tiempo de Viaje: {calcularDuracion(horaSalida, horaLlegada)}
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
