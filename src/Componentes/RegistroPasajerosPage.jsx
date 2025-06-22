import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PasajerosForm from './PasajerosForm';
import './Estilos/RegistroPasajerosPage.css';
import Button from './Button';

const RegistroPasajerosPage = () => {
  const navigate = useNavigate();

  // Esta función se pasará al formulario
  const handleRegistroExitoso = () => {
    navigate('/TripSelectionPage');
  };

  return (
    <div className="registro-pasajeros-page">
      <header>
        <Header currentStep={3} totalSteps={5} />
      </header>

      <main className="contenido-pasajeros">
        <h2 className="titulo-pasajeros">Pasajeros</h2>
        <p className="subtitulo">
          Ingrese los datos de cada pasajero tal y como aparecen en el pasaporte o documento de identidad
        </p>

        <div className="contenedor-formulario">
          <PasajerosForm onRegistroExitoso={handleRegistroExitoso} />
        </div>

        <div className="contenedor-botones">
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

export default RegistroPasajerosPage;

