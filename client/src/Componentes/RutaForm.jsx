import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import './Estilos/RutaForm.css';
import 'leaflet/dist/leaflet.css';

// Configuración de íconos Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const center = [-1.8312, -78.1834]; // Centro de Ecuador

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
  const [nuevaParada, setNuevaParada] = useState('');
  const [marcadores, setMarcadores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    if (Array.isArray(ruta.paradas)) {
      setParadas(ruta.paradas.filter(p => typeof p === 'string'));
    }
  }, [ruta]);

  const agregarParadaManual = () => {
    const nombre = nuevaParada.trim();
    if (nombre && !paradas.includes(nombre)) {
      setParadas(prev => [...prev, nombre]);
      setNuevaParada('');
    }
  };

  const agregarParadaDesdeMapa = (nombreLugar, coords) => {
    if (!paradas.includes(nombreLugar)) {
      setParadas((prev) => [...prev, nombreLugar]);
      setMarcadores((prev) => [...prev, coords]);
    }
  };

  const eliminarParada = (index) => {
    setParadas(prev => prev.filter((_, i) => i !== index));
    setMarcadores(prev => prev.filter((_, i) => i !== index));
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
    setResultados([]);
    setBusqueda('');
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

      <div style={{ padding: '16px' }}>
        {/* Input manual */}
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            value={nuevaParada}
            onChange={(e) => setNuevaParada(e.target.value)}
            placeholder="Ej: Latacunga, Riobamba, etc."
            style={{
              width: '80%',
              padding: '8px',
              fontSize: '15px',
              marginRight: '8px',
              borderRadius: '8px',
              border: '1.5px solid #2176ab'
            }}
          />
          <button className="btn-control" onClick={agregarParadaManual}>
            Agregar Parada
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar lugar en el mapa..."
            style={{
              width: '80%',
              padding: '8px',
              fontSize: '15px',
              marginRight: '8px',
              borderRadius: '8px',
              border: '1.5px solid #888'
            }}
          />
          <button className="btn-control" onClick={buscarLugar}>
            Buscar
          </button>
        </div>

        {/* Resultados de búsqueda */}
        {resultados.length > 0 && (
          <ul style={{
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            marginBottom: '12px',
            maxHeight: '150px',
            overflowY: 'auto',
            listStyle: 'none'
          }}>
            {resultados.map((item, i) => (
              <li
                key={i}
                onClick={() => seleccionarResultado(item)}
                style={{
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderBottom: '1px solid #eee'
                }}
              >
                {item.display_name}
              </li>
            ))}
          </ul>
        )}

        {/* Mapa */}
        <MapContainer
          center={center}
          zoom={7}
          style={{
            height: '400px',
            width: '100%',
            marginBottom: '16px',
            border: '2px solid #2176ab',
            borderRadius: '12px'
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <ClickHandler onUbicacionSeleccionada={agregarParadaDesdeMapa} />
          {marcadores.map((coord, i) => (
            <Marker key={i} position={[coord.lat, coord.lng]} />
          ))}
        </MapContainer>

        {/* Lista de paradas */}
        <h4>Paradas Seleccionadas</h4>
        <ul style={{
          fontSize: '14px',
          maxHeight: '180px',
          overflowY: 'auto',
          padding: '0',
          listStyle: 'none',
          marginTop: '12px'
        }}>
          {paradas.map((p, i) => (
            <li key={i} style={{
              background: '#f2f2f2',
              borderRadius: '8px',
              padding: '8px 12px',
              marginBottom: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <span style={{ flex: 1, marginRight: '10px' }}>{p}</span>
              <button
                onClick={() => eliminarParada(i)}
                style={{
                  background: 'transparent',
                  color: '#c0392b',
                  fontWeight: 'bold',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>

        <button
          className="btn-control"
          onClick={guardarRuta}
          style={{ marginTop: '16px' }}
        >
          Guardar Ruta
        </button>
      </div>
    </section>
  );
};

export default RutaForm;
