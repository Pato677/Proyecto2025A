import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Estilos/SeatSelector.css';

const SeatSelector = ({ onSeleccionAsiento, asientosSeleccionados = [], numeroPasajeros = 1, viajeId }) => {
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cargar asientos disponibles y ocupados
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
        }
        
        // Obtener asientos ocupados del viaje específico
        if (viajeId) {
          const ocupadosResponse = await axios.get(`http://localhost:8000/asientos/ocupados/${viajeId}`);
          if (ocupadosResponse.data.success) {
            setOccupiedSeats(ocupadosResponse.data.data || []);
          }
        }
        
      } catch (error) {
        console.error('Error al cargar asientos:', error);
        // En caso de error, usar asientos del 1 al 44 como fallback
        const asientosFallback = Array.from({ length: 44 }, (_, i) => (i + 1).toString());
        setAvailableSeats(asientosFallback);
        setOccupiedSeats(['3', '7', '15', '22', '28']);
      } finally {
        setLoading(false);
      }
    };
    
    cargarAsientos();
  }, [viajeId]);
  
  const handleSeatClick = (seat) => {
    if (!occupiedSeats.includes(seat)) {
      if (asientosSeleccionados.includes(seat)) {
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
            const isOccupied = occupiedSeats.includes(seat);
            const isSelected = asientosSeleccionados.includes(seat);
            return (
              <button
                key={seat}
                className={`seat 
                  ${isOccupied ? 'occupied' : ''} 
                  ${isSelected ? 'selected' : ''}`}
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
