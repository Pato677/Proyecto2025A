import React from 'react';
import './Estilos/FormasDePagoPage.css';
import Header from './Header';
import Footer from './Footer';
import TablaPasajeros from './TablaPasajeros';
import TicketInfo from './Ticket (12)/TicketInfo';
import Button from './Button';

const FormasDePagoPage = () => {
  return (
    <div className="pago-resumen-page">
      <header >
        <Header currentStep={5} totalSteps={5} />
      </header>

      <div className="contenido-pago">
        <div>
            <h2 className="titulo-pago">Formas de Pago</h2>

        </div>

        <div className="ticket-info-box">
            <TicketInfo/>
        </div>

        {/* Forma de pago */}
        <div className="forma-pago-box">
          <label className='lblFormadepago'>Forma de pago</label>
          <select className='select-forma-pago'>
            <option value="" >Seleccione una opción</option>
          </select>
        </div>
        <div className="tabla-pasajeros-box">
            <TablaPasajeros />
        </div>

        {/* Botones */}
        <div className="contenedor-botones">
          <Button text="Atras" width='150px' />
          <Button text="Aceptar" width='150px'/>
        </div>
      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default FormasDePagoPage;
