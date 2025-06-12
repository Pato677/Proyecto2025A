import React, { useState } from 'react';
import './Estilos/SeleccionAsientosPage.css';
import SeatSelector from './SeatSelector';
import StepProgress from './StepProgress'; // Asegúrate de que la ruta sea correcta
import Footer from './Footer';



const SeleccionAsientosPage = () => {
  return (
    <div className="page-container">
      <header className="header">
        <div className="logo-info">
          <img src="/logo-bus.png" alt="Logo" className="logo" />
          <div>
            <strong>Viaje: Quito - Guayaquil</strong>
            <div>Viernes. 25 Abril. 2025</div>
          </div>
        </div>
        <div className="step-info">
          <span>1 Adulto</span>
          <div className="step-progress">
                <StepProgress currentStep={5} totalSteps={5} />
          </div>
   
          <button className="precio">USD 12,<sup>25</sup></button>
        </div>
      </header>

      <div className="main">
        <section className="info-section">
          <h2>Selecciona tus asientos</h2>
          <p>Elige como quieres viajar, ventana o pasillo</p>

          <button className="ruta-btn">UIO - GYE</button>

          <div className="card transporte">
            <span className="circle-te">TE</span>
            <div className="card-text">
              <strong>Transportes Ecuador</strong>
              <a href="#" className="seleccionar-link">Seleccionar asiento</a>
            </div>
          </div>

          <div className="legend">
            <div><span className="legend-dot green"></span> Asiento seleccionado</div>
            <div><span className="legend-dot gray"></span> Asiento no disponible</div>
          </div>


        </section>
        <div>
            <SeatSelector />
        </div>
        <div>
          <button className="btn-atras">ATRÁS</button>
            <button className="btn-aceptar">ACEPTAR</button>

        </div>

        
           
      </div>

      <footer className="footer">
        <Footer />
      </footer>
    </div>
  );
};

export default SeleccionAsientosPage;