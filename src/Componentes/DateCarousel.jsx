import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Estilos/DateCarousel.css';

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatFecha(date) {
  const dias = ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'];
  const meses = [
    'Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.',
    'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'
  ];
  return `${dias[date.getDay()]} ${date.getDate()} de ${meses[date.getMonth()]}`;
}

export default function DateCarousel({ fechaSeleccionada }) {
  // Si no hay fechaSeleccionada, usa hoy
  const baseDate = fechaSeleccionada ? new Date(fechaSeleccionada) : new Date();
  baseDate.setHours(0, 0, 0, 0);

  // Genera 7 fechas: 3 antes, la base, 3 después
  const dates = [];
  for (let i = -3; i <= 3; i++) {
    const d = addDays(baseDate, i);
    dates.push({
      label: formatFecha(d),
      value: d
    });
  }

  const [selected, setSelected] = useState(baseDate);
  const containerRef = useRef();

  // Si cambia la prop, actualiza el seleccionado
  useEffect(() => {
    if (fechaSeleccionada) {
      const nueva = new Date(fechaSeleccionada);
      nueva.setHours(0, 0, 0, 0);
      setSelected(nueva);
    }
  }, [fechaSeleccionada]);

  // Fecha de hoy (sin horas)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

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
          const disabled = d.value < hoy;
          return (
            <button
              key={d.label}
              className={`date-item${active ? ' active' : ''}${disabled ? ' disabled' : ''}`}
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

