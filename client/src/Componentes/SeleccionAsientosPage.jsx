import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import SeatSelector from './SeatSelector';
import StepProgress from './StepProgress'; // Asegúrate de que la ruta sea correcta
import Login from './Login';
import { FaUser } from 'react-icons/fa';
import './Estilos/SeleccionAsientosPage.css';
import Footer from './Footer';
import Logo from './Imagenes/Logo.png';

const SeleccionAsientosPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const params = new URLSearchParams(location.search);
  
  // Función para decodificar datos de pasajeros desde URL
  const decodificarDatosPasajeros = () => {
    const datosEncoded = params.get('datosP');
    if (datosEncoded) {
      try {
        const datosDecoded = decodeURIComponent(datosEncoded);
        return JSON.parse(datosDecoded);
      } catch (error) {
        console.error('Error al decodificar datos de pasajeros:', error);
        return [];
      }
    }
    return [];
  };

  // Función para decodificar asientos seleccionados desde URL
  const decodificarAsientosSeleccionados = () => {
    const asientosEncoded = params.get('asientos');
    if (asientosEncoded) {
      try {
        const asientosDecoded = decodeURIComponent(asientosEncoded);
        return JSON.parse(asientosDecoded);
      } catch (error) {
        console.error('Error al decodificar asientos seleccionados:', error);
        return [];
      }
    }
    return [];
  };

  // Obtener datos de los pasajeros desde URL
  const pasajerosData = decodificarDatosPasajeros();
  const numeroPasajeros = pasajerosData.length;
  const viajeId = params.get('viajeId');
  
  // Obtener asientos previamente seleccionados desde URL
  const asientosYaSeleccionados = decodificarAsientosSeleccionados();

  // Estado para el precio del viaje
  const [precioViaje, setPrecioViaje] = useState(0.00);

  // Estados para el modal de login y menú de usuario
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Estado para mapear IDs a numeraciones de asientos
  const [asientosMap, setAsientosMap] = useState({});
  const [asientosOcupados, setAsientosOcupados] = useState([]);

  // Cargar datos del viaje y asientos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar precio del viaje
        if (viajeId) {
          const viajeRes = await axios.get(`http://localhost:8000/viajes/${viajeId}`);
          if (viajeRes.data.success && viajeRes.data.data) {
            setPrecioViaje(parseFloat(viajeRes.data.data.precio) || 0);
          }
        }

        // Cargar todos los asientos para crear el mapa ID -> numeración
        const asientosRes = await axios.get('http://localhost:8000/asientos');
        if (asientosRes.data.success && asientosRes.data.data) {
          const mapa = {};
          asientosRes.data.data.forEach(asiento => {
            mapa[asiento.id] = asiento.numeracion;
          });
          setAsientosMap(mapa);
          console.log('Mapa de asientos creado:', mapa);
        }

        // Cargar asientos ocupados del viaje específico
        if (viajeId) {
          const ocupadosRes = await axios.get(`http://localhost:8000/asientos/ocupados/${viajeId}`);
          if (ocupadosRes.data.success && ocupadosRes.data.data) {
            console.log('Numeraciones de asientos ocupados:', ocupadosRes.data.data);
            setAsientosOcupados(ocupadosRes.data.data);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    cargarDatos();
  }, [viajeId]);

  // Los asientos ocupados ya vienen como numeraciones del backend
  const asientosOcupadosNumeraciones = asientosOcupados;
  
  console.log('Numeraciones de asientos ocupados que se enviarán al SeatSelector:', asientosOcupadosNumeraciones);
  
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

  // Funciones para manejar login y logout
  const handleLoginClick = () => {
    setMostrarLogin(true);
  };

  const handleLoginExitoso = (usuarioData) => {
    console.log('Login exitoso:', usuarioData);
    setMostrarLogin(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const handleAtras = () => {
    // Crear nueva URL con todos los parámetros necesarios incluyendo asientos seleccionados
    const nuevosParams = new URLSearchParams(location.search);
    
    // Codificar datos de pasajeros en la URL
    if (pasajerosData.length > 0) {
      try {
        const datosString = JSON.stringify(pasajerosData);
        const datosEncoded = encodeURIComponent(datosString);
        nuevosParams.set('datosP', datosEncoded);
      } catch (error) {
        console.error('Error al codificar datos de pasajeros:', error);
      }
    }

    // Codificar asientos seleccionados en la URL
    if (asientosSeleccionados.length > 0) {
      try {
        const asientosString = JSON.stringify(asientosSeleccionados);
        const asientosEncoded = encodeURIComponent(asientosString);
        nuevosParams.set('asientos', asientosEncoded);
      } catch (error) {
        console.error('Error al codificar asientos seleccionados:', error);
      }
    }
    
    navigate(`/RegistroPasajerosPage?${nuevosParams.toString()}`);
  };

  const handleAceptar = () => {
    if (asientosSeleccionados.length === numeroPasajeros) {
      // Crear nueva URL con todos los parámetros necesarios incluyendo asientos seleccionados
      const nuevosParams = new URLSearchParams(location.search);
      
      // Codificar datos de pasajeros en la URL
      if (pasajerosData.length > 0) {
        try {
          const datosString = JSON.stringify(pasajerosData);
          const datosEncoded = encodeURIComponent(datosString);
          nuevosParams.set('datosP', datosEncoded);
        } catch (error) {
          console.error('Error al codificar datos de pasajeros:', error);
        }
      }

      // Codificar asientos seleccionados en la URL
      try {
        const asientosString = JSON.stringify(asientosSeleccionados);
        const asientosEncoded = encodeURIComponent(asientosString);
        nuevosParams.set('asientos', asientosEncoded);
      } catch (error) {
        console.error('Error al codificar asientos seleccionados:', error);
      }
      
      navigate(`/FormasDePagoPage?${nuevosParams.toString()}`);
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
        
        {/* Botón de login/usuario en la esquina superior derecha */}
        <div className="user-section">
          {usuario ? (
            <div
              className="user-dropdown"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <FaUser className="user-icon" />
              <span className="user-name">
                {usuario.nombres ? usuario.nombres.split(' ')[0] : 
                 usuario.correo ? usuario.correo.split('@')[0] : 
                 'Usuario'} 
              </span>
              {menuOpen && (
                <div className="dropdown-content">
                  <div onClick={() => navigate('/PerfilUsuario')}>Mi perfil</div>
                  <div onClick={handleLogout}>Cerrar sesión</div>
                </div>
              )}
            </div>
          ) : (
            <div className="login-area" onClick={handleLoginClick}>
              <FaUser className="user-icon" />
              <span className="login-text">Iniciar Sesión</span>
            </div>
          )}
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
              asientosOcupadosNumeraciones={asientosOcupadosNumeraciones}
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

        {/* Modal de Login */}
        {mostrarLogin && (
          <Login 
            cerrar={() => setMostrarLogin(false)}
            onLoginExitoso={handleLoginExitoso}
            shouldRedirect={false}
          />
        )}
      
    </div>
  );
};

export default SeleccionAsientosPage;