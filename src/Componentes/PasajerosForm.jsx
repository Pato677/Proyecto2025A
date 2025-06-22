import React from 'react';
import './Estilos/PasajeroForm.css';

const PasajerosForm = ({
  numeroPasajero = 1,
  datos = {},
  onChange,
  onRegistroExitoso
}) => {
  const handleInput = e => {
    const { name, value } = e.target;
    if (onChange) onChange({ [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (onRegistroExitoso) onRegistroExitoso();
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-pasajero">
      <h3>
        Pasajero {numeroPasajero} {numeroPasajero === 1 ? '(Titular)' : ''}
      </h3>
      <div className="grupo">
        <input
          type="text"
          placeholder="Nombres*"
          name="nombres"
          value={datos.nombres || ''}
          onChange={handleInput}
        />
        <input
          type="text"
          placeholder="Apellidos*"
          name="apellidos"
          value={datos.apellidos || ''}
          onChange={handleInput}
        />
      </div>
      <div className="grupo">
        <input
          type="text"
          placeholder="Cédula*"
          name="cedula"
          value={datos.cedula || ''}
          onChange={handleInput}
        />
      </div>
      <div className="grupo-fecha">
        <label>Fecha de nacimiento*</label>
        <div className="fecha">
          <select name="dia" value={datos.dia || ''} onChange={handleInput}>
            <option value="">Día*</option>
            {/* ...opciones... */}
          </select>
          <select name="mes" value={datos.mes || ''} onChange={handleInput}>
            <option value="">Mes*</option>
            {/* ...opciones... */}
          </select>
          <select name="anio" value={datos.anio || ''} onChange={handleInput}>
            <option value="">Año*</option>
            {/* ...opciones... */}
          </select>
        </div>
      </div>
      <div className="grupo">
        <input
          type="email"
          placeholder="Correo Electrónico*"
          name="correo"
          value={datos.correo || ''}
          onChange={handleInput}
        />
        <input
          type="tel"
          placeholder="Teléfono*"
          name="telefono"
          value={datos.telefono || ''}
          onChange={handleInput}
        />
      </div>
    </form>
  );
};

export default PasajerosForm;
