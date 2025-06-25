import React, { useState } from 'react';
import './Estilos/SeatSelector.css';


const seatLayout = [
  ['1A', '1B', '1C', '1D'],
  ['2A', '2B', '2C', '2D'],
  ['3A', '3B', '3C', '3D'],
  ['4A', '4B', '4C', '4D'],
  ['5A', '5B', '5C', '5D'],
  ['6A', '6B', '6C', '6D'],
  ['7A', '7B', '7C', '7D'],
  ['8A', '8B', '8C', '8D'],
  ['9A', '9B', '9C', '9D'],
  ['10A', '10B', '10C', '10D'],
];

const occupiedSeats = ['1C', '1D', '3A', '5C', '5D', '6B', '7C'];

const SeatSelector = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleSeatClick = (seat) => {
    if (!occupiedSeats.includes(seat)) {
      setSelectedSeat(seat);
    }
  };

  return (

    <div className="seat-selector">
      
      {seatLayout.map((row, rowIdx) => (
        <div className="seat-row" key={rowIdx}>
          {row.map((seat) => {
            const isOccupied = occupiedSeats.includes(seat);
            const isSelected = selectedSeat === seat;
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
