import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import './Estilos/RutaForm.css';
import 'leaflet/dist/leaflet.css';

// Coordenadas de Quito
const quitoCenter = [-0.22985, -78.52495];

// Íconos personalizados
const iconAzul = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const iconRojo = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [35, 55],
  iconAnchor: [17, 55],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const ClickHandler = ({ onUbicacionSeleccionada }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        const nombreLugar = data.display_name;

        if (nombreLugar) {
          onUbicacionSeleccionada(nombreLugar, { lat, lng });
        } else {
          alert('⚠️ No se pudo obtener la dirección.');
        }
      } catch (error) {
        alert('❌ Error al obtener la dirección desde el mapa.');
      }
    }
  });
  return null;
};

const RutaForm = ({ ruta = {}, onClose, onRutaActualizada }) => {
  const [paradas, setParadas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [marcadores, setMarcadores] = useState([]);
  const [paradaSeleccionada, setParadaSeleccionada] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const cargarParadas = async () => {
      if (Array.isArray(ruta.paradas)) {
        setParadas(ruta.paradas);
        const nuevasCoordenadas = [];

        for (const parada of ruta.paradas) {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(parada)}`
            );
            const data = await res.json();
            if (data && data.length > 0) {
              nuevasCoordenadas.push({
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
              });
            } else {
              nuevasCoordenadas.push(null);
            }
          } catch (e) {
            nuevasCoordenadas.push(null);
          }
        }

        setMarcadores(nuevasCoordenadas);

        const puntosValidos = nuevasCoordenadas.filter(p => p !== null);
        if (puntosValidos.length > 0 && mapRef.current) {
          const bounds = L.latLngBounds(puntosValidos.map(p => [p.lat, p.lng]));
          mapRef.current.fitBounds(bounds, { padding: [30, 30] });
        }

        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }, 300);
      }
    };

    cargarParadas();
  }, [ruta]);

  const agregarParadaDesdeMapa = (nombreLugar, coords) => {
    if (!paradas.includes(nombreLugar)) {
      setParadas(prev => [...prev, nombreLugar]);
      setMarcadores(prev => [...prev, coords]);
    }
  };

  const buscarLugar = async () => {
    if (!busqueda.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(busqueda)}`
      );
      const data = await res.json();
      setResultados(data);
    } catch (error) {
      console.error('Error al buscar lugar:', error);
    }
  };

  const seleccionarResultado = (item) => {
    const nombre = item.display_name;
    const coords = {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    };
    agregarParadaDesdeMapa(nombre, coords);
    setBusqueda('');
    setResultados([]);
  };

  const eliminarParada = (index) => {
    setParadas(prev => prev.filter((_, i) => i !== index));
    setMarcadores(prev => prev.filter((_, i) => i !== index));
    if (paradaSeleccionada === index) {
      setParadaSeleccionada(null);
    } else if (paradaSeleccionada > index) {
      setParadaSeleccionada(paradaSeleccionada - 1);
    }
  };

  const guardarRuta = () => {
    if (!ruta.id) {
      alert('❌ Error: la ruta no tiene un ID válido.');
      return;
    }

    const rutaActualizada = {
      ...ruta,
      paradas
    };

    axios.put(`http://localhost:3000/Rutas/${ruta.id}`, rutaActualizada)
      .then(() => {
        alert('✅ Paradas actualizadas correctamente.');
        if (onRutaActualizada) onRutaActualizada();
        if (onClose) onClose();
      })
      .catch((err) => {
        console.error('Error al actualizar', err);
        alert('❌ Error al guardar las paradas');
      });
  };

  return (
    <section className="ruta-form ruta-form--modal">
      <header className="ruta-form__header">Editar Ruta {ruta.numeroRuta}</header>

      <div className="busqueda-container">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar lugar o hacer clic en el mapa..."
        />
        <button onClick={buscarLugar}>Buscar</button>
      </div>

      {resultados.length > 0 && (
        <ul className="resultados-lista">
          {resultados.map((item, i) => (
            <li key={i} onClick={() => seleccionarResultado(item)}>
              {item.display_name}
            </li>
          ))}
        </ul>
      )}

      <MapContainer
        center={quitoCenter}
        zoom={12}
        style={{
          height: '400px',
          width: '100%',
          marginBottom: '16px',
          border: '2px solid #2176ab',
          borderRadius: '12px'
        }}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ClickHandler onUbicacionSeleccionada={agregarParadaDesdeMapa} />
        {marcadores.map((coord, i) =>
          coord ? (
            <Marker
              key={i}
              position={[coord.lat, coord.lng]}
              icon={i === paradaSeleccionada ? iconRojo : iconAzul}
            >
              <Tooltip direction="top" offset={[0, -10]} permanent>
                {paradas[i]}
              </Tooltip>
            </Marker>
          ) : null
        )}
        {marcadores.filter(Boolean).length >= 2 && (
          <Polyline positions={marcadores.filter(Boolean).map(p => [p.lat, p.lng])} color="#2d8cf0" />
        )}
      </MapContainer>

      <h4>Paradas Seleccionadas</h4>
      <ul className="paradas-lista">
        {paradas.map((p, i) => (
          <li
            key={i}
            onClick={() => {
              setParadaSeleccionada(i);
              if (marcadores[i] && mapRef.current) {
                mapRef.current.setView([marcadores[i].lat, marcadores[i].lng], 16, {
                  animate: true
                });
              }
            }}
            style={{
              background: i === paradaSeleccionada ? '#dbeafe' : '#f2f9ff',
              cursor: 'pointer'
            }}
          >
            <span>{p}</span>
            <button onClick={(e) => {
              e.stopPropagation();
              eliminarParada(i);
            }}>❌</button>
          </li>
        ))}
      </ul>

      <button className="btn-control" onClick={guardarRuta}>
        Guardar Ruta
      </button>
    </section>
  );
};

export default RutaForm;
