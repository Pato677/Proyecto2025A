import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import Footer from './Footer';
import Button from './Button';
import { FaSearch, FaGlobe, FaUserCircle } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Estilos/LiveLocation.css';

function LiveLocationHeader({ usuario, onLogout }) {
  const getNombreUsuario = () => {
    if (!usuario) return 'Iniciar Sesión';
    
    if (usuario.rol === 'cooperativa') {
      return usuario.razonSocial || usuario.UsuarioCooperativa?.razon_social || 'Cooperativa';
    } else if (usuario.rol === 'final') {
      const nombre = usuario.nombreCompleto || 
                    (usuario.nombres && usuario.apellidos ? 
                     `${usuario.nombres} ${usuario.apellidos}` : 
                     (usuario.UsuarioFinal ? 
                      `${usuario.UsuarioFinal.nombres} ${usuario.UsuarioFinal.apellidos}` : 
                      'Usuario'));
      return nombre;
    } else if (usuario.rol === 'superadmin') {
      return 'Super Usuario root';
    }
    
    return usuario.correo?.split('@')[0] || 'Usuario';
  };

  return (
    <header className="live-header">
      <div className="live-header-left">
        <img src={require('./Imagenes/Logo.png')} alt="Logo" className="live-logo" />
        <span className="live-title">Transportes EC</span>
      </div>
      <div className="live-header-right">
        <div className="live-search">
          <FaSearch className="live-search-icon" />
        </div>
        <span className="live-ticket-code">AB4M3</span>
        <span className="live-separator">|</span>
        <FaGlobe className="live-globe" />
        <span className="live-language">Español</span>
        <span className="live-separator">|</span>
        <FaUserCircle className="live-user" />
        <span className="live-user-label" onClick={usuario && onLogout ? onLogout : undefined} style={{ cursor: usuario ? 'pointer' : 'default' }}>
          {getNombreUsuario()}
        </span>
      </div>
    </header>
  );
}

function LiveMapSimulation() {
  const rutaCoordenadas = [
    [-0.0933, -78.4784], // Terminal Carcelén
    [-0.1015, -78.4810],
    [-0.1075, -78.4816],
    [-0.1139, -78.4824],
    [-0.1202, -78.4831],
    [-0.1248, -78.4842],
    [-0.1301, -78.4850],
    [-0.1352, -78.4856],
    [-0.1399, -78.4863],
    [-0.1445, -78.4870],
    [-0.1490, -78.4875],
    [-0.1538, -78.4880],
    [-0.1584, -78.4885],
    [-0.1620, -78.4890],
    [-0.1662, -78.4893],
    [-0.1705, -78.4896],
    [-0.1747, -78.4899],
    [-0.1780, -78.4898],
    [-0.1810, -78.4889],
    [-0.2152, -78.5127], // Palacio de Carondelet
  ];


  const [posicion, setPosicion] = useState(rutaCoordenadas[0]);
  const indexRef = useRef(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current < rutaCoordenadas.length) {
        setPosicion(rutaCoordenadas[indexRef.current]);
      } else {
        clearInterval(intervalo);
      }
    }, 3000); // cada segundo

    return () => clearInterval(intervalo);
  }, []);

  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41]
  });

  function CenterMapOnMarker() {
    const map = useMap();
    useEffect(() => {
      map.setView(posicion, 13);
    }, [posicion, map]);
    return null;
  }

  return (
    <div className="live-map-container">
      <MapContainer center={posicion} zoom={16} scrollWheelZoom={false} style={{ height: '650px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CenterMapOnMarker />
        <Marker position={posicion} icon={markerIcon} />
        <Polyline positions={rutaCoordenadas} pathOptions={{ color: 'blue' }} />
      </MapContainer>
    </div>
  );
}

function LiveLocationPage() {
  const { usuario, logout } = useAuth();
  
  return (
    <div className="ticket-page">
      <LiveLocationHeader usuario={usuario} onLogout={() => logout()} />
      <main className="live-main-content">
        <h1 className="live-title-main">Ubicación en Tiempo Real</h1>
        <p className="live-estimated-time">Hora de llegada aproximada: 21:35</p>

        <LiveMapSimulation />

        <div className="live-button-group">
          <div className="btnCompartir">
            <Button text="Compartir Ubicación" />
          </div>
          <div className="btnAtras">
            <Button text="Atras" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LiveLocationPage;
