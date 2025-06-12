import React from 'react';
import Header from './Header';  // Asegúrate de importar esto correctamente
import Footer from './Footer';
import PasajerosForm from './PasajerosForm';  // Asegúrate de importar el formulario de pasajeros
import './Estilos/RegistroPasajerosPage.css';

const RegistroPasajerosPage = () => {
  return (
    <div className="registro-pasajeros-page">
      <header>
        <Header />
      </header>

      <main className="contenido-pasajeros">
        <h2 className="titulo-pasajeros">Pasajeros</h2>
        <p className="subtitulo">
          Ingrese los datos de cada pasajero tal y como aparecen en el pasaporte o documento de identidad
        </p>

        <div className="contenedor-formulario">
          <PasajerosForm />
        </div>

        <div className="contenedor-botones">
          <button className="btn-atras">ATRÁS</button>
          <button className="btn-aceptar">ACEPTAR</button>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default RegistroPasajerosPage;

