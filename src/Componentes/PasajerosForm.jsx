import React from 'react';
import './Estilos/PasajeroForm.css';

const PasajeroForm = () => {
  return (
    <div className="formulario-pasajero">
      <h3>Pasajero 1 (Titular)</h3>
      
      <div className="grupo">
        <input type="text" placeholder="Nombres*" />
        <input type="text" placeholder="Apellidos*" />
      </div>

      <div className="grupo">
        <input type="text" placeholder="Cédula*" />
      </div>

      <div className="grupo-fecha">
        <label>Fecha de nacimiento*</label>
        <div className="fecha">
          <select><option>Día*</option></select>
          <select><option>Mes*</option></select>
          <select><option>Año*</option></select>
        </div>
      </div>

      <div className="grupo">
        <input type="email" placeholder="Correo Electrónico*" />
        <input type="tel" placeholder="Teléfono*" />
      </div>
    </div>
  );
};

export default PasajeroForm;
