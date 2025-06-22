import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PasajerosForm from './PasajerosForm';
import './Estilos/RegistroPasajerosPage.css';
import Button from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RegistroPasajerosPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef();

  // Obtener número de pasajeros de la URL
  const params = new URLSearchParams(location.search);
  const pasajeros = parseInt(params.get('pasajeros'), 10) || 1;

  // Estado para el formulario actual
  const [formIndex, setFormIndex] = useState(0);

  // Estado para los datos de los pasajeros
  const [datosPasajeros, setDatosPasajeros] = useState(
    Array.from({ length: pasajeros }, () => ({
      nombres: '',
      apellidos: '',
      cedula: '',
      dia: '',
      mes: '',
      anio: '',
      correo: '',
      telefono: ''
    }))
  );

  // Esta función se pasará al formulario
  const handleRegistroExitoso = () => {
    navigate('/TripSelectionPage');
  };

  // Función para actualizar los datos de un pasajero
  const handleChangePasajero = (index, nuevosDatos) => {
    setDatosPasajeros(prev =>
      prev.map((p, i) => (i === index ? { ...p, ...nuevosDatos } : p))
    );
  };

  const handleAceptar = () => {
    if (formRef.current && formRef.current.validar()) {
      // El formulario es válido y onRegistroExitoso ya navega
    }
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
          <button
            className="pagina-btn flecha-pasajero"
            onClick={() => setFormIndex(formIndex - 1)}
            disabled={formIndex === 0}
            aria-label="Pasajero anterior"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="formulario-pasajero">
            <PasajerosForm
              ref={formRef}
              key={formIndex}
              numeroPasajero={formIndex + 1}
              datos={datosPasajeros[formIndex]}
              onChange={nuevosDatos => handleChangePasajero(formIndex, nuevosDatos)}
              onRegistroExitoso={handleRegistroExitoso}
            />
            <div className="info-pasajero">
              Pasajero {formIndex + 1} de {pasajeros}
            </div>
          </div>
          <button
            className="pagina-btn flecha-pasajero"
            onClick={() => setFormIndex(formIndex + 1)}
            disabled={formIndex === pasajeros - 1}
            aria-label="Pasajero siguiente"
          >
            <ChevronRight size={28} />
          </button>
        </div>
        <div className="contenedor-botones">
          <Button text="Atras" width='150px' onClick={() => navigate(-1)} />
          <Button text="Aceptar" width='150px' onClick={handleAceptar} />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default RegistroPasajerosPage;

