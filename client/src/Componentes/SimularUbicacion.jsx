// SimuladorUbicacionModal.js
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Estilos/SimuladorUbicacion.css';

const iconBus = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/61/61231.png', // ícono de autobús
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const SimuladorUbicacionModal = ({ onClose }) => {
  const mapRef = useRef();
  const [posicionActual, setPosicionActual] = useState(null);

  // Coordenadas desde la Terminal de Carcelén al Palacio de Carondelet (siguiendo calles reales)
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

  useEffect(() => {
    if (rutaCoordenadas.length > 0) {
      setPosicionActual(rutaCoordenadas[0]);
      if (mapRef.current) {
        mapRef.current.setView(rutaCoordenadas[0], 13);
      }
    }

    let i = 1;
    const intervalo = setInterval(() => {
      if (i < rutaCoordenadas.length) {
        setPosicionActual(rutaCoordenadas[i]);
        i++;
      } else {
        clearInterval(intervalo);
      }
    }, 1500);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
        <h3>Simulación en tiempo real - Carcelén a Carondelet</h3>
        <MapContainer
          center={[-0.0933, -78.4784]}
          zoom={13}
          style={{ height: '62.5vh', width: '100%' }}
          whenCreated={(map) => { mapRef.current = map; }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={rutaCoordenadas} color="blue" />
          {posicionActual && <Marker position={posicionActual} icon={iconBus} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default SimuladorUbicacionModal;
