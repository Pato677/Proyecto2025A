import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import DateCarousel from './DateCarousel';
import TripCard from './TripCard';
import TripDetails from './TripDetails';
import Modal from './Modal';
import Footer from './Footer';
import Header from './Header';
import './Estilos/Footer.css';
import './Estilos/SeleccionViaje.css';
import Button from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TripSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  // Parámetros de búsqueda
  const origenCiudad = params.get('origenCiudad');
  const origenTerminal = params.get('origenTerminal');
  const destinoCiudad = params.get('destinoCiudad');
  const destinoTerminal = params.get('destinoTerminal');
  const fechaSeleccionada = params.get('fecha');
  const pasajeros = params.get('pasajeros');

  // Estados
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [viajes, setViajes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orden, setOrden] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const viajesPorPagina = 4;

  // Cargar usuario
  useEffect(() => {
    const usuarioStorage = JSON.parse(localStorage.getItem('usuario'));
    if (usuarioStorage) {
      setUsuario(usuarioStorage);
    }
  }, []);

  // Cargar viajes
  useEffect(() => {
    if (!origenCiudad || !destinoCiudad) return;
    
    axios.get(`http://localhost:3000/Viajes`, {
      params: { origenCiudad, destinoCiudad }
    })
    .then(res => setViajes(res.data))
    .catch(() => setViajes([]));
  }, [origenCiudad, destinoCiudad]);

  // Manejadores
  const handleSelectTrip = (id) => {
    setSelectedTrip(id);
    setShowDetails(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  // Ordenar viajes
  let viajesOrdenados = [...viajes];
  if (orden === 'precio') {
    viajesOrdenados.sort((a, b) => a.precio - b.precio);
  } else if (orden === 'hora') {
    viajesOrdenados.sort((a, b) => {
      const [ha, ma] = a.horaSalida.split(':').map(Number);
      const [hb, mb] = b.horaSalida.split(':').map(Number);
      return ha !== hb ? ha - hb : ma - mb;
    });
  }

  // Paginación
  const totalPaginas = Math.ceil(viajesOrdenados.length / viajesPorPagina);
  const viajesPagina = viajesOrdenados.slice(
    (currentPage - 1) * viajesPorPagina,
    currentPage * viajesPorPagina
  );

  return (
    <div className="trip-selection-page">
      <Header 
        currentStep={2} 
        totalSteps={5}
        usuario={usuario}
        onLogout={handleLogout}
      />

      <main className="contenido-viajes">
        <DateCarousel fechaSeleccionada={fechaSeleccionada} />

        <h2 className="titulo-viaje">
          Viaje: {origenCiudad} - {destinoCiudad}
        </h2>

        <div className="filtros">
          <span className="filtrar-label">Filtrar por:</span>
          <button
            className={`filtro-btn${orden === 'precio' ? ' activa' : ''}`}
            onClick={() => { setOrden('precio'); setCurrentPage(1); }}
          >
            Mejor precio
          </button>
          <button
            className={`filtro-btn${orden === 'hora' ? ' activa' : ''}`}
            onClick={() => { setOrden('hora'); setCurrentPage(1); }}
          >
            Más reciente
          </button>
        </div>

        <div className="lista-viajes">
          {viajesPagina.map((viaje) => (
            <div
              key={viaje.id}
              className={`viaje-item ${selectedTrip === viaje.id ? 'viaje-seleccionado' : ''}`}
              onClick={() => handleSelectTrip(viaje.id)}
            >
              <TripCard
                horaSalida={viaje.horaSalida}
                horaLlegada={viaje.horaLlegada}
                empresa={viaje.empresa}
                precio={viaje.precio}
              />
              {selectedTrip === viaje.id && showDetails && <TripDetails />}
            </div>
          ))}
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
                setShowModal(true);
                return;
              }
              const params = new URLSearchParams({
                origenCiudad,
                origenTerminal,
                destinoCiudad,
                destinoTerminal,
                fecha: fechaSeleccionada,
                pasajeros,
                viajeId: selectedTrip
              }).toString();
              navigate(`/RegistroPasajerosPage?${params}`);
            }}
          />
        </div>
      </main>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div style={{ marginBottom: 16, fontSize: '1.1rem', color: '#3077c6', textAlign: 'center' }}>
          Por favor, selecciona un viaje antes de continuar.
        </div>
      </Modal>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default TripSelectionPage;