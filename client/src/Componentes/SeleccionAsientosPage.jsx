import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import SeatSelector from './SeatSelector';
import StepProgress from './StepProgress'; // Asegúrate de que la ruta sea correcta
import './Estilos/SeleccionAsientosPage.css';
import Footer from './Footer';
import Logo from './Imagenes/Logo.png';

const SeleccionAsientosPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const params = new URLSearchParams(location.search);
  
  // Obtener datos de los pasajeros desde localStorage
  const pasajerosData = localStorage.getItem('pasajerosData') 
    ? JSON.parse(localStorage.getItem('pasajerosData')) 
    : [];
  const numeroPasajeros = pasajerosData.length;
  const viajeId = params.get('viajeId');
  
  // Obtener asientos previamente seleccionados desde localStorage
  const asientosYaSeleccionados = localStorage.getItem('asientosSeleccionados') 
    ? JSON.parse(localStorage.getItem('asientosSeleccionados')) 
    : [];

  // Estado para el precio del viaje
  const [precioViaje, setPrecioViaje] = useState(0.00);

  // Cargar datos del viaje
  useEffect(() => {
    if (viajeId) {
      axios.get(`http://localhost:8000/viajes/${viajeId}`)
        .then(res => {
          if (res.data.success && res.data.data) {
            setPrecioViaje(parseFloat(res.data.data.precio) || 0);
          }
        })
        .catch(error => {
          console.error('Error al cargar precio del viaje:', error);
        });
    }
  }, [viajeId]);
  
  // Estado para los asientos seleccionados - inicializar con asientos previos si existen
  const [asientosSeleccionados, setAsientosSeleccionados] = useState(asientosYaSeleccionados);
  
  // Estado para mostrar qué pasajero está seleccionando asiento
  const [pasajeroActual, setPasajeroActual] = useState(asientosYaSeleccionados.length > 0 ? asientosYaSeleccionados.length : 0);

  const handleSeleccionAsiento = (numeroAsiento) => {
    if (asientosSeleccionados.length < numeroPasajeros && 
        !asientosSeleccionados.includes(numeroAsiento)) {
      setAsientosSeleccionados([...asientosSeleccionados, numeroAsiento]);
      
      // Avanzar al siguiente pasajero si no es el último
      if (pasajeroActual < numeroPasajeros - 1) {
        setPasajeroActual(pasajeroActual + 1);
      }
    }
  };

  const handleDeseleccionarAsiento = (numeroAsiento) => {
    const nuevosAsientos = asientosSeleccionados.filter(asiento => asiento !== numeroAsiento);
    setAsientosSeleccionados(nuevosAsientos);
    
    // Ajustar el pasajero actual
    if (nuevosAsientos.length > 0) {
      setPasajeroActual(nuevosAsientos.length - 1);
    } else {
      setPasajeroActual(0);
    }
  };

  const handleAtras = () => {
    // Guardar los asientos actuales en localStorage antes de navegar hacia atrás
    localStorage.setItem('asientosSeleccionados', JSON.stringify(asientosSeleccionados));
    
    // Mantener solo el viajeId y otros parámetros necesarios en la URL
    const allParams = new URLSearchParams(location.search);
    navigate(`/RegistroPasajerosPage?${allParams.toString()}`);
  };

  const handleAceptar = () => {
    if (asientosSeleccionados.length === numeroPasajeros) {
      // Guardar los asientos seleccionados en localStorage
      localStorage.setItem('asientosSeleccionados', JSON.stringify(asientosSeleccionados));
      
      // Pasar solo el viajeId por URL
      const allParams = new URLSearchParams(location.search);
      navigate(`/FormasDePagoPage?${allParams.toString()}`);
    } else {
      alert(`Debe seleccionar ${numeroPasajeros} asientos para todos los pasajeros.`);
    }
  };
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
          <span>{numeroPasajeros} {numeroPasajeros === 1 ? 'Pasajero' : 'Pasajeros'}</span>
          <div className="step-progress">
                <StepProgress currentStep={4} totalSteps={5} />
          </div>
   
          <button className="precio">USD {precioViaje.toFixed(2).replace('.', ',')}</button>
        </div>
      </header>
      
      

      <div className="main">
        <div className="title-container">
          <h2>Selecciona tus asientos</h2>
          <p>Elige como quieres viajar, ventana o pasillo</p>
          
          {/* Mensaje informativo si hay asientos previamente seleccionados */}
          {asientosYaSeleccionados.length > 0 && (
            <div className="asientos-previos-info">
              <p><strong>ℹ️ Se han conservado tus asientos previamente seleccionados.</strong></p>
              <p>Puedes modificar tu selección o continuar con los asientos actuales.</p>
            </div>
          )}
          
          {/* Información del pasajero actual */}
          {asientosSeleccionados.length < numeroPasajeros && (
            <div className="pasajero-actual-info">
              <p><strong>Seleccionando asiento para:</strong> {pasajerosData[pasajeroActual]?.nombres} {pasajerosData[pasajeroActual]?.apellidos}</p>
              <p>Pasajero {pasajeroActual + 1} de {numeroPasajeros}</p>
            </div>
          )}
          
          {/* Mostrar asientos ya seleccionados */}
          {asientosSeleccionados.length > 0 && (
            <div className="asientos-seleccionados-info">
              <h4>Asientos seleccionados:</h4>
              {asientosSeleccionados.map((asiento, index) => (
                <div key={index} className="asiento-pasajero">
                  <span>Asiento {asiento}: {pasajerosData[index]?.nombres} {pasajerosData[index]?.apellidos}</span>
                  <button 
                    onClick={() => handleDeseleccionarAsiento(asiento)}
                    className="btn-deseleccionar"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
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
            <SeatSelector 
              onSeleccionAsiento={handleSeleccionAsiento}
              asientosSeleccionados={asientosSeleccionados}
              numeroPasajeros={numeroPasajeros}
              viajeId={viajeId}
            />
          </div>


        </section>
        
        <div className='button-group'>
          <button className="btn-atras" onClick={handleAtras}>ATRÁS</button>
          <button 
            className="btn-aceptar" 
            onClick={handleAceptar}
            disabled={asientosSeleccionados.length !== numeroPasajeros}
          >
            ACEPTAR ({asientosSeleccionados.length}/{numeroPasajeros})
          </button>
        </div>

        
           
      </div>

    
        <Footer />
      
    </div>
  );
};

export default SeleccionAsientosPage;