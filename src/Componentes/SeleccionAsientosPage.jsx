import React from 'react';

import SeatSelector from './SeatSelector';
import StepProgress from './StepProgress'; // Asegúrate de que la ruta sea correcta
import './Estilos/SeleccionAsientosPage.css';
import Footer from './Footer';
import Logo from './Imagenes/Logo.png';



const SeleccionAsientosPage = () => {
  return (
    <div className="page-container">

      <header className="header">
        <div className="logo-info">
          <img src={Logo} alt="Logo" className="logo" />
          <div>
            <strong>Viaje: Quito - Guayaquil</strong>
            <div>Viernes. 25 Abril. 2025</div>
          </div>
        </div>
        <div className="step-info">
          <span>1 Adulto</span>
          <div className="step-progress">
                <StepProgress currentStep={4} totalSteps={5} />
          </div>
   
          <button className="precio">USD 12,<sup>25</sup></button>
        </div>
      </header>
      
      

      <div className="main">
        <div className="title-container">
          <h2>Selecciona tus asientos</h2>
           <p>Elige como quieres viajar, ventana o pasillo</p>
        </div>
        <section className="info-section">
          <div className='ruta-info'>
            <div className='ruta-button'>
              <button className="ruta-btn">UIO - GYE</button>
            </div>
            

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
          </div>
        

          
          <div className='seat-selector'>
            <SeatSelector />
          </div>


        </section>
        
        <div className='button-group'>
          <button className="btn-atras">ATRÁS</button>
            <button className="btn-aceptar">ACEPTAR</button>

        </div>

        
           
      </div>

    
        <Footer />
      
    </div>
  );
};

export default SeleccionAsientosPage;