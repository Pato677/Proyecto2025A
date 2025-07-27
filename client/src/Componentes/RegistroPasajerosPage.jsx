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

  // Variable de prueba para el número de pasajeros (posteriormente se obtendrá via query)
  const numeroPasajerosPrueba = 2; // Cambiar este valor para probar con diferentes números de pasajeros
  const viajeIdPrueba = 2; // ID del viaje para pruebas (posteriormente se obtendrá via query)
  
  // Obtener número de pasajeros de la URL
  const params = new URLSearchParams(location.search);
  const pasajeros = numeroPasajerosPrueba; // Usar la variable de prueba

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
    // Pasar los datos de los pasajeros y el ID del viaje a la siguiente página
    const params = new URLSearchParams(location.search);
    params.set('pasajerosData', JSON.stringify(datosPasajeros));
    params.set('viajeId', viajeIdPrueba);
    navigate(`/SeleccionAsientosPage?${params.toString()}`);
  };

  // Función para actualizar los datos de un pasajero
  const handleChangePasajero = (index, nuevosDatos) => {
    setDatosPasajeros(prev =>
      prev.map((p, i) => (i === index ? { ...p, ...nuevosDatos } : p))
    );
  };

  const handleAceptar = () => {
    // Validar todos los formularios de pasajeros
    let todosValidos = true;
    
    for (let i = 0; i < pasajeros; i++) {
      const pasajero = datosPasajeros[i];
      
      // Validaciones básicas para todos los pasajeros
      if (!pasajero.nombres || !pasajero.apellidos || !pasajero.cedula || 
          !pasajero.dia || !pasajero.mes || !pasajero.anio) {
        todosValidos = false;
        break;
      }
      
      // Validaciones adicionales para el primer pasajero (titular)
      if (i === 0 && (!pasajero.correo || !pasajero.telefono)) {
        todosValidos = false;
        break;
      }
    }
    
    if (todosValidos) {
      handleRegistroExitoso();
    } else {
      alert('Por favor, complete todos los datos requeridos de todos los pasajeros antes de continuar.');
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

