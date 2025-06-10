import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Estilos/DateCarousel.css';

export default function DateCarousel() {
  const dates = [
    { label: 'Sáb. 24 de May.', value: new Date(2025, 4, 24) },
    { label: 'Dom. 25 de May.', value: new Date(2025, 4, 25) },
    { label: 'Lun. 26 de May.', value: new Date(2025, 4, 26) },
    { label: 'Mar. 27 de May.', value: new Date(2025, 4, 27) },
    { label: 'Mié. 28 de May.', value: new Date(2025, 4, 28) },
    { label: 'Jue. 29 de May.', value: new Date(2025, 4, 29) },
    { label: 'Vie. 30 de May.', value: new Date(2025, 4, 30) },
  ];
  const [selected, setSelected] = useState(dates[3].value);
  const containerRef = useRef();

  return (
    <div className="date-carousel">
      <button
        className="date-carousel-button"
        onClick={() =>
          containerRef.current.scrollBy({ left: -150, behavior: 'smooth' })
        }
      >
        <ChevronLeft size={24} />
      </button>

      <div className="date-carousel-container" ref={containerRef}>
        {dates.map((d, i) => {
          const active = d.value.getTime() === selected.getTime();
          const disabled = i === 6; // el último (Vie. 30) lo mostramos grayed
          return (
            <button
              key={d.label}
              className={`date-item ${active ? 'active' : ''}`}
              onClick={() => !disabled && setSelected(d.value)}
              disabled={disabled}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      <button
        className="date-carousel-button"
        onClick={() =>
          containerRef.current.scrollBy({ left: 150, behavior: 'smooth' })
        }
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

