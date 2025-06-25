import React from "react";
import "./Estilos/TripDetails.css";



const TripDetails = () => {
  return (
    <div className="tripdetails-container">
      <div className="tripdetails-features">
        <div className="tripdetails-col">
          <div className="feature-item">
            <span className="check">&#10003;</span> Asientos disponibles: 12
          </div>
          <div className="feature-item">
            <span className="check">&#10003;</span> Aire Acondicionado
          </div>
          <div className="feature-item">
            <span className="check">&#10003;</span> Conexión WI-FI
          </div>
        </div>
        <div className="tripdetails-col">
          <div className="feature-item">
            <span className="check">&#10003;</span> Conexión USB
          </div>
          <div className="feature-item">
            <span className="check">&#10003;</span> Baño a bordo
          </div>
          <div className="feature-item">
            <span className="check">&#10003;</span> Televisión
          </div>
        </div>
        <div className="tripdetails-col">
          <div className="feature-item">
            <span className="check">&#10003;</span> Asientos reclinables
          </div>
        </div>
      </div>
      <div className="tripdetails-image">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTniBavDs0ryKktooFw1Io0omjJ21el3J16WA&s"
          alt="Bus Velotax"
        />
      </div>
    </div>
  );
};

export default TripDetails;
