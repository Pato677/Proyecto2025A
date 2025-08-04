import React from 'react';
import './Estilos/BusLoader.css';
import busVideo from '../Recursos/bus-loader.mp4';

const BusLoader = () => {
  return (
    <div className="bus-loader-container">
      <video
        className="bus-loader-video"
        src={busVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="bus-loader-text">
        Cargando
        <span className="bus-loader-dots">
          <span className="bus-loader-dot"></span>
          <span className="bus-loader-dot"></span>
          <span className="bus-loader-dot"></span>
        </span>
      </div>
    </div>
  );
};


export default BusLoader;
