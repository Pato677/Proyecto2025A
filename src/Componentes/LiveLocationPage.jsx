import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Button from './Button';

function LiveLocationPage() {
  return (
    <div className="ticket-page">
      <Header showStep={false} />

      <main className="main-content">
        <h1>Ubicación en Tiempo Real</h1>
        <p className="estimated-time">Hora de llegada aproximada: 21:35</p>

        <div className="map-container">
          <img
            src="https://i.imgur.com/7Q2XPKX.png"
            alt="Mapa en tiempo real"
            className="map-image"
          />
        </div>

        <div className="button-group">
          <Button text="Compartir ubicación" />
          <Button text="ATRÁS" />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LiveLocationPage;
