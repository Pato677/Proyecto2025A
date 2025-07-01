import React from 'react';
import './Estilos/DatePicker.css';

const DatePicker = ({ value, onChange }) => (
  <input
    type="date"
    value={value}
    onChange={e => onChange(e.target.value)}
    className="datepicker-input"
  />
);

export default DatePicker;