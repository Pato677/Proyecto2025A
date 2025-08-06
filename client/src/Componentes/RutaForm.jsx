import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import SimpleErrorModal from './SimpleErrorModal';
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

const ClickHandler = ({ onUbicacionSeleccionada, onError }) => {
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
          onError('No se pudo obtener la dirección.');
        }
      } catch (error) {
        console.error('Error al obtener la dirección desde el mapa:', error);
        onError('Error al obtener la dirección desde el mapa.');
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
  const [terminalesDisponibles, setTerminalesDisponibles] = useState([]);
  const [paradaSeleccionada, setParadaSeleccionada] = useState(null);
  const mapRef = useRef(null);

  // Estado para el modal de error
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Función helper para mostrar errores
  const mostrarError = (mensaje) => {
    setErrorMessage(mensaje);
    setShowErrorModal(true);
  };

  // Cargar terminales disponibles al montar el componente
  useEffect(() => {
    const cargarTerminales = async () => {
      try {
        const response = await axios.get('http://localhost:8000/terminales-paradas');
        if (response.data.success) {
          setTerminalesDisponibles(response.data.data);
        }
      } catch (error) {
        console.error('Error al cargar terminales:', error);
      }
    };
    cargarTerminales();
  }, []);

  useEffect(() => {
    const cargarParadasDeRuta = async () => {
      if (ruta.paradas && Array.isArray(ruta.paradas)) {
        console.log('Cargando paradas existentes:', ruta.paradas);
        
        // Cargar paradas existentes (strings de nombres)
        setParadas(ruta.paradas);
        
        // Crear marcadores en el mapa obteniendo coordenadas de Nominatim
        const nuevasCoordenadas = [];
        for (const nombreParada of ruta.paradas) {
          try {
            // Intentar varias búsquedas para obtener mejores resultados
            let coordenadas = null;
            
            // Primera búsqueda: con "Quito Ecuador"
            let res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(nombreParada + ' Quito Ecuador')}&limit=1`
            );
            let data = await res.json();
            
            // Si no encuentra, intentar solo con "Quito"
            if (!data || data.length === 0) {
              res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(nombreParada + ' Quito')}&limit=1`
              );
              data = await res.json();
            }
            
            // Si aún no encuentra, intentar solo el nombre
            if (!data || data.length === 0) {
              res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(nombreParada)}&limit=1`
              );
              data = await res.json();
            }
            
            if (data && data.length > 0) {
              coordenadas = {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
              };
            }
            
            nuevasCoordenadas.push(coordenadas);
            
            // Pequeña pausa para no sobrecargar la API
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (e) {
            console.error('Error al buscar coordenadas para', nombreParada, ':', e);
            nuevasCoordenadas.push(null);
          }
        }

        console.log('Marcadores establecidos:', nuevasCoordenadas.filter(Boolean).length, 'de', nuevasCoordenadas.length);
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
        }, 500); // Aumentamos el timeout un poco
      }
    };

    if (ruta.paradas && Array.isArray(ruta.paradas) && ruta.paradas.length > 0) {
      cargarParadasDeRuta();
    }
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

  // Agregar terminal como parada (ahora usando solo el nombre como string)
  const agregarTerminalComoParada = async (terminal) => {
    try {
      // Buscar coordenadas del terminal en Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(terminal.nombre + ' ' + terminal.ciudad)}`
      );
      const data = await res.json();
      
      let coordenadas = null;
      if (data && data.length > 0) {
        coordenadas = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }

      // Agregar solo el nombre como string
      setParadas(prev => [...prev, terminal.nombre]);
      setMarcadores(prev => [...prev, coordenadas]);
      
      if (coordenadas && mapRef.current) {
        mapRef.current.setView([coordenadas.lat, coordenadas.lng], 14, {
          animate: true
        });
      }
    } catch (error) {
      console.error('Error al buscar coordenadas del terminal:', error);
      // Agregar el terminal como string aunque no se encuentren coordenadas
      setParadas(prev => [...prev, terminal.nombre]);
      setMarcadores(prev => [...prev, null]);
    }
  };

  const guardarRuta = async () => {
    if (!ruta.id) {
      mostrarError('Error: la ruta no tiene un ID válido.');
      return;
    }

    if (paradas.length === 0) {
      mostrarError('Error: Debe agregar al menos una parada.');
      return;
    }

    // Las paradas ahora son strings, no necesitamos extraer IDs
    const rutaActualizada = {
      paradas: paradas // Array de strings
    };

    try {
      console.log('Actualizando paradas de la ruta:', ruta.id, rutaActualizada);
      // Usar el endpoint específico para actualizar paradas
      const response = await axios.put(`http://localhost:8000/rutas/${ruta.id}/paradas`, rutaActualizada);
      
      if (response.data.success) {
        mostrarError('Paradas actualizadas correctamente.');
        console.log('Paradas actualizadas:', response.data.data);
        if (onRutaActualizada) onRutaActualizada();
        if (onClose) onClose();
      } else {
        throw new Error(response.data.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error al actualizar paradas:', error);
      mostrarError(`Error al guardar las paradas: ${error.response?.data?.message || error.message}`);
    }
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
        <ClickHandler onUbicacionSeleccionada={agregarParadaDesdeMapa} onError={mostrarError} />
        {marcadores.map((coord, i) => {
          return coord && coord.lat && coord.lng ? (
            <Marker
              key={i}
              position={[coord.lat, coord.lng]}
              icon={i === paradaSeleccionada ? iconRojo : iconAzul}
            >
              <Tooltip direction="top" offset={[0, -10]} permanent>
                {paradas[i] || `Parada ${i + 1}`}
              </Tooltip>
            </Marker>
          ) : null;
        })}
        {marcadores.filter(Boolean).length >= 2 && (
          <Polyline positions={marcadores.filter(Boolean).map(p => [p.lat, p.lng])} color="#2d8cf0" />
        )}
      </MapContainer>

      {/* Selector de terminales para agregar paradas */}
      <div className="form-group" style={{ marginBottom: '16px' }}>
        <label htmlFor="selector-terminal" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Agregar Terminal como Parada:
        </label>
        <select
          id="selector-terminal"
          className="form-control"
          value=""
          onChange={(e) => {
            if (e.target.value) {
              const terminal = terminalesDisponibles.find(t => t.id === parseInt(e.target.value));
              if (terminal && !paradas.includes(terminal.nombre)) {
                agregarTerminalComoParada(terminal);
              }
              e.target.value = ""; // Reset selector
            }
          }}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="">Seleccione un terminal...</option>
          {terminalesDisponibles
            .filter(terminal => !paradas.includes(terminal.nombre))
            .map(terminal => (
              <option key={terminal.id} value={terminal.id}>
                {terminal.label}
              </option>
            ))
          }
        </select>
      </div>

      <h4>Paradas Seleccionadas</h4>
      <ul className="paradas-lista">
        {paradas.map((parada, i) => (
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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 'bold' }}>{parada}</span>
            </div>
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

      {/* Modal de Error */}
      {showErrorModal && (
        <SimpleErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </section>
  );
};

export default RutaForm;
