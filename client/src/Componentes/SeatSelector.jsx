import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Estilos/SeatSelector.css';

const SeatSelector = ({ onSeleccionAsiento, asientosSeleccionados = [], numeroPasajeros = 1, viajeId, asientosOcupadosNumeraciones = [] }) => {
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Usar los asientos ocupados que vienen como prop, o hacer fallback a la llamada API
  const occupiedSeats = asientosOcupadosNumeraciones.length > 0 ? asientosOcupadosNumeraciones : [];
  
  console.log('SeatSelector - Asientos ocupados recibidos como prop:', asientosOcupadosNumeraciones);
  console.log('SeatSelector - Asientos ocupados que se usarán:', occupiedSeats);
  
  // Cargar solo los asientos disponibles
  useEffect(() => {
    const cargarAsientos = async () => {
      try {
        setLoading(true);
        
        // Obtener todos los asientos de la base de datos
        const asientosResponse = await axios.get('http://localhost:8000/asientos');
        if (asientosResponse.data.success) {
          const asientos = asientosResponse.data.data
            .map(asiento => asiento.numeracion)
            .sort((a, b) => parseInt(a) - parseInt(b)); // Ordenar numéricamente
          setAvailableSeats(asientos);
          console.log('SeatSelector - Asientos disponibles cargados:', asientos);
        }
        
      } catch (error) {
        console.error('Error al cargar asientos:', error);
        // En caso de error, usar asientos del 1 al 44 como fallback
        const asientosFallback = Array.from({ length: 44 }, (_, i) => (i + 1).toString());
        setAvailableSeats(asientosFallback);
      } finally {
        setLoading(false);
      }
    };
    
    cargarAsientos();
  }, []);
  
  const handleSeatClick = (seat) => {
    const seatStr = seat.toString();
    const occupiedSeatsStr = occupiedSeats.map(s => s.toString());
    const asientosSeleccionadosStr = asientosSeleccionados.map(s => s.toString());
    
    if (!occupiedSeatsStr.includes(seatStr)) {
      if (asientosSeleccionadosStr.includes(seatStr)) {
        // Si el asiento ya está seleccionado, no hacer nada o permitir deselección
        // Por ahora mantenemos simple y no permitimos deselección desde aquí
        return;
      } else if (asientosSeleccionados.length < numeroPasajeros) {
        // Solo permitir selección si no hemos alcanzado el límite
        onSeleccionAsiento(seat);
      }
    }
  };

  // Generar layout dinámico basado en los asientos disponibles
  const generarSeatLayout = () => {
    const layout = [];
    const asientosPorFila = 4;
    
    for (let i = 0; i < availableSeats.length; i += asientosPorFila) {
      const fila = availableSeats.slice(i, i + asientosPorFila);
      if (fila.length > 0) {
        layout.push(fila);
      }
    }
    
    return layout;
  };

  if (loading) {
    return (
      <div className="seat-selector">
        <div className="loading">Cargando asientos...</div>
      </div>
    );
  }

  const seatLayout = generarSeatLayout();

  return (
    <div className="seat-selector">
      
      {seatLayout.map((row, rowIdx) => (
        <div className="seat-row" key={rowIdx}>
          {row.map((seat) => {
            const seatStr = seat.toString();
            const isOccupied = occupiedSeats.map(s => s.toString()).includes(seatStr);
            const isSelected = asientosSeleccionados.map(s => s.toString()).includes(seatStr);
            
            // Debug para ver qué está pasando con cada asiento
            if (isOccupied) {
              console.log(`Asiento ${seatStr} está marcado como ocupado`);
            }
            
            return (
              <button
                key={seat}
                className={`seat ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`.trim()}
                onClick={() => handleSeatClick(seat)}
                disabled={isOccupied}
              >
                {isOccupied ? '✖' : seat}
              </button>
            );
          })}
        </div>
      ))}
    </div>

  );
};

export default SeatSelector;
