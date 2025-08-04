import React, { useState, useEffect } from 'react';
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

function parseLocalDate(fechaStr) {
  // fechaStr: "2025-06-23"
  const [year, month, day] = fechaStr.split('-').map(Number);
  return new Date(year, month - 1, day); // Mes base 0
}

export default function DateCarousel({ fechaSeleccionada, onFechaChange }) {
  // Si no hay fechaSeleccionada, usa hoy
  const initialBaseDate = fechaSeleccionada
    ? parseLocalDate(fechaSeleccionada)
    : new Date();
  initialBaseDate.setHours(0, 0, 0, 0);

  const [baseDate, setBaseDate] = useState(initialBaseDate);
  const [selected, setSelected] = useState(initialBaseDate);

  // Si cambia la prop, actualiza el seleccionado y baseDate
  useEffect(() => {
    if (fechaSeleccionada) {
      const nueva = parseLocalDate(fechaSeleccionada);
      nueva.setHours(0, 0, 0, 0);
      setSelected(nueva);
      setBaseDate(nueva);
    }
  }, [fechaSeleccionada]);

  // Al seleccionar una fecha, llama a la función del padre
  const handleSelectDate = (d) => {
    if (onFechaChange) {
      // Formatea la fecha a 'YYYY-MM-DD'
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      onFechaChange(`${yyyy}-${mm}-${dd}`);
    }
    setSelected(d);
  };

  // Genera 7 fechas: 3 antes, la base, 3 después
  const dates = [];
  for (let i = -3; i <= 3; i++) {
    const d = addDays(baseDate, i);
    dates.push({
      label: formatFecha(d),
      value: d
    });
  }

  // Fecha de hoy (sin horas)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Avanzar o retroceder el carrusel
  const handlePrev = () => setBaseDate(addDays(baseDate, -3));
  const handleNext = () => setBaseDate(addDays(baseDate, 3));

  return (
    <div className="date-carousel">
      <button
        className="date-carousel-button"
        onClick={handlePrev}
        aria-label="Fechas anteriores"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="date-carousel-container">
        {dates.map((d, i) => {
          const active = d.value.getTime() === selected.getTime();
          const disabled = d.value < hoy;
          return (
            <button
              key={d.label}
              className={`date-item${active ? ' active' : ''}${disabled ? ' disabled' : ''}`}
              onClick={() => !disabled && handleSelectDate(d.value)}
              disabled={disabled}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      <button
        className="date-carousel-button"
        onClick={handleNext}
        aria-label="Fechas siguientes"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

