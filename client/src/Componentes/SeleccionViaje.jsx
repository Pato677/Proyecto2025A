import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import DateCarousel from './DateCarousel';
import TripCard from './TripCard';
import TripDetails from './TripDetails';
import InfoModal from './InfoModal';
import WarningModal from './WarningModal';
import Footer from './Footer';
import Header from './Header';
import Login from './Login';
import Registro from './Registro';
import PerfilUsuarioModal from './PerfilUsuarioModal';
import './Estilos/Footer.css';
import './Estilos/SeleccionViaje.css';
import Button from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TripSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuth();
  const params = new URLSearchParams(location.search);
  
  // Parámetros de búsqueda
  const origenCiudad = params.get('origenCiudad');
  const origenTerminal = params.get('origenTerminal');
  const destinoCiudad = params.get('destinoCiudad');
  const destinoTerminal = params.get('destinoTerminal');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    params.get('fecha') || new Date().toISOString().slice(0, 10)
  );
  const pasajeros = params.get('pasajeros');

  // Estados
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const viajesPorPagina = 4;
  const [viajes, setViajes] = useState([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [orden, setOrden] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  // Cargar viajes desde el endpoint por fecha, página y orden
  useEffect(() => {
    if (!fechaSeleccionada) return;

    const query = [
      `page=${currentPage}`,
      `size=${viajesPorPagina}`,
      orden ? `orden=${orden}` : '',
      origenTerminal ? `terminalOrigen=${origenTerminal}` : '',
      destinoTerminal ? `terminalDestino=${destinoTerminal}` : ''
    ].filter(Boolean).join('&');

    axios.get(`http://localhost:8000/viajes/fecha/${fechaSeleccionada}?${query}`)
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setViajes(res.data.data);
          setTotalPaginas(Math.ceil(res.data.total / viajesPorPagina));
        } else {
          setViajes([]);
          setTotalPaginas(1);
        }
      })
      .catch(() => {
        setViajes([]);
        setTotalPaginas(1);
      });
  }, [fechaSeleccionada, currentPage, viajesPorPagina, orden, origenTerminal, destinoTerminal]);

  useEffect(() => {
    if (viajes.length > 0 && params.get('viajeId')) {
      const viajeId = Number(params.get('viajeId'));
      const existe = viajes.find(v => v.id === viajeId);
      if (existe) {
        setSelectedTrip(viajeId);
        setShowDetails(true);
      }
    }
  }, [viajes, params]);

  useEffect(() => {
    const viajeId = params.get('viajeId');
    if (
      viajeId &&
      fechaSeleccionada &&
      origenTerminal &&
      destinoTerminal &&
      viajes.length >= 0 &&
      !viajes.some(v => v.id === Number(viajeId))
    ) {
      axios.get(`http://localhost:8000/viajes/${viajeId}`)
        .then(res => {
          if (res.data.success && res.data.data) {
            setViajes(prev => {
              // Solo agrega si no existe
              if (!prev.some(v => v.id === res.data.data.id)) {
                return [res.data.data, ...prev];
              }
              return prev;
            });
          }
        });
    }
  }, [viajes, params, fechaSeleccionada, origenTerminal, destinoTerminal]);

  // Manejadores
  const handleSelectTrip = (id) => {
    if (selectedTrip === id) {
      setSelectedTrip(null);      // Deselecciona si ya está seleccionado
      setShowDetails(false);
    } else {
      setSelectedTrip(id);
      setShowDetails(true);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleLoginExitoso = (usuarioData) => {
    // El usuario se actualiza automáticamente a través del AuthContext
    setMostrarLogin(false);
  };

  const handleConfirmTrip = () => {
    const params = new URLSearchParams({
      origenCiudad,
      origenTerminal,
      destinoCiudad,
      destinoTerminal,
      fecha: fechaSeleccionada,
      pasajeros,
      viajeId: selectedTrip,
      fresh: 'true' // Agregar parámetro para limpiar localStorage
    }).toString();
    navigate(`/RegistroPasajerosPage?${params}`);
  };

  // Ordenar viajes
  let viajesOrdenados = [...viajes];
  if (orden === 'precio') {
    viajesOrdenados.sort((a, b) => Number(a.precio) - Number(b.precio));
  } else if (orden === 'hora') {
    viajesOrdenados.sort((a, b) => {
      // Usar hora_salida de la ruta
      const [ha, ma] = a.ruta?.hora_salida?.split(':').map(Number) || [0,0];
      const [hb, mb] = b.ruta?.hora_salida?.split(':').map(Number) || [0,0];
      return ha !== hb ? ha - hb : ma - mb;
    });
  }

  // Cuando cambia la fecha, regresa a la página 1
  const handleFechaChange = (nuevaFecha) => {
    setFechaSeleccionada(nuevaFecha);
    setCurrentPage(1);
  };

  return (
    <div className="trip-selection-page">
      <Header 
        currentStep={2} 
        totalSteps={5}
        usuario={usuario}
        onLogout={handleLogout}
        onLoginClick={() => setMostrarLogin(true)}
        onPerfilClick={() => setMostrarPerfil(true)}
      />

      <main className="contenido-viajes">
        <DateCarousel
          fechaSeleccionada={fechaSeleccionada}
          onFechaChange={handleFechaChange}
        />

        <h2 className="titulo-viaje">
          Viaje: {origenCiudad} - {destinoCiudad}
        </h2>

        <div className="filtros">
          <span className="filtrar-label">Filtrar por:</span>
          <button
            className={`filtro-btn${orden === 'precio' ? ' activa' : ''}`}
            onClick={() => {
              setOrden(orden === 'precio' ? '' : 'precio');
              setCurrentPage(1);
            }}
          >
            Mejor precio
          </button>
          <button
            className={`filtro-btn${orden === 'hora' ? ' activa' : ''}`}
            onClick={() => {
              setOrden(orden === 'hora' ? '' : 'hora');
              setCurrentPage(1);
            }}
          >
            Más reciente
          </button>
        </div>

        <div className="lista-viajes">
          {viajes.length === 0 ? (
            <div className="mensaje-sin-viajes">
              <h3>Ups... Sentimos las molestias</h3>
              <p>No encontramos viajes en esta ruta.<br />Prueba con una fecha diferente.</p>
            </div>
          ) : (
            viajes.map((viaje) => (
              <div
                key={viaje.id}
                className={`viaje-item ${selectedTrip === viaje.id ? 'viaje-seleccionado' : ''}`}
                onClick={() => handleSelectTrip(viaje.id)}
              >
                {selectedTrip === viaje.id && (
                  <div className="badge-viaje-seleccionado">Viaje Seleccionado</div>
                )}
                <TripCard
                  horaSalida={viaje.ruta?.hora_salida}
                  horaLlegada={viaje.ruta?.hora_llegada}
                  empresa={viaje.ruta?.UsuarioCooperativa?.razon_social}
                  precio={viaje.precio}
                  terminalOrigen={viaje.ruta?.terminalOrigen?.nombre}
                  terminalDestino={viaje.ruta?.terminalDestino?.nombre}
                  ciudadOrigen={viaje.ruta?.terminalOrigen?.ciudad?.nombre}
                  ciudadDestino={viaje.ruta?.terminalDestino?.ciudad?.nombre}
                  unidad={viaje.unidad}
                />
                {selectedTrip === viaje.id && showDetails && (
                  <TripDetails viaje={viaje} />
                )}
              </div>
            ))
          )}
        </div>

        <div className="paginacion">
          <button
            className="pagina-btn"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i + 1}
              className={`pagina-btn${currentPage === i + 1 ? ' activa' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="pagina-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPaginas || totalPaginas === 0}
            aria-label="Página siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="botones-finales">
          <Button
            text="Atrás"
            width="150px"
            onClick={() => {
              const params = new URLSearchParams({
                origenCiudad,
                origenTerminal,
                destinoCiudad,
                destinoTerminal,
                fecha: fechaSeleccionada,
                pasajeros
              }).toString();
              navigate(`/Inicio?${params}`);
            }}
          />
          <Button
            text="Aceptar"
            width="150px"
            disabled={!selectedTrip}
            onClick={() => {
              if (!selectedTrip) {
                setShowInfoModal(true);
                return;
              }
              setShowWarningModal(true);
            }}
          />
        </div>

        {/* Modal informativo (sin viaje seleccionado) */}
        <InfoModal
          open={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          title="Selección requerida"
          message="Por favor, selecciona un viaje antes de continuar."
        />

        {/* Modal de advertencia de tiempo */}
        <WarningModal
          open={showWarningModal}
          onClose={() => setShowWarningModal(false)}
          onConfirm={() => {
            setShowWarningModal(false);
            handleConfirmTrip();
          }}
        />

        {/* Modal de Login */}
        {mostrarLogin && (
          <Login
            cerrar={() => setMostrarLogin(false)}
            abrirRegistro={() => {
              setMostrarLogin(false);
              setMostrarRegistro(true);
            }}
            onLoginExitoso={handleLoginExitoso}
          />
        )}

        {/* Modal de Registro */}
        {mostrarRegistro && (
          <Registro
            cerrar={() => setMostrarRegistro(false)}
            abrirCooperativa={() => {
              setMostrarRegistro(false);
              // Aquí podrías agregar lógica para abrir modal de cooperativa si es necesario
            }}
          />
        )}

        {/* Modal de Perfil */}
        {mostrarPerfil && (
          <PerfilUsuarioModal
            cerrar={() => setMostrarPerfil(false)}
          />
        )}
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default TripSelectionPage;