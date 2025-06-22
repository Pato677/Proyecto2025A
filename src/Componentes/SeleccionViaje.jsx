import React, { useState } from 'react';
import DateCarousel from './DateCarousel';
import TripCard from './TripCard';
import TripDetails from './TripDetails';
import Footer from './Footer';
import Header from './Header';
import "./Estilos/Footer.css";
import "./Estilos/SeleccionViaje.css";
import Button from './Button';

const TripSelectionPage = () => {
  const [selectedTrip, setSelectedTrip] = useState(1);
  const [showDetails, setShowDetails] = useState(true);

  const viajes = [
    { id: 1, horaSalida: '13:30', horaLlegada: '21:30', empresa: 'Velotax', precio: '12.25' },
    { id: 2, horaSalida: '14:20', horaLlegada: '22:30', empresa: 'Panamericana', precio: '14.83' },
    { id: 3, horaSalida: '15:30', horaLlegada: '23:30', empresa: 'Flota Imbabura', precio: '17.85' },
  ];

  const handleSelectTrip = (id) => {
    setSelectedTrip(id);
    setShowDetails(true);
  };

  return (
    <div className="trip-selection-page">
      <Header
      currentStep={2} totalSteps={5}
      />

      <main className="contenido-viajes">
        <DateCarousel />

        <h2 className="titulo-viaje">Viaje: Quito - Guayaquil</h2>

        <div className="filtros">
          <span className="filtrar-label">Filtrar por:</span>
          <button className="filtro-btn">Mejor precio</button>
          <button className="filtro-btn">Más reciente</button>
        </div>

        <div className="lista-viajes">
          {viajes.map((viaje) => (
            <div
              key={viaje.id}
              className={`viaje-item ${selectedTrip === viaje.id ? 'viaje-seleccionado' : ''}`}
              onClick={() => handleSelectTrip(viaje.id)}
            >
              <TripCard />
              {selectedTrip === viaje.id && showDetails && <TripDetails />}
            </div>
          ))}
        </div>

        <div className="botones-finales">
          <Button text="Atras" width='150px' />
          <Button text="Aceptar" width='150px' />
        </div>
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default TripSelectionPage;
