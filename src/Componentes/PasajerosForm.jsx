import React from 'react';
import './Estilos/PasajeroForm.css';

const dias = Array.from({ length: 31 }, (_, i) => i + 1);
const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const anioActual = new Date().getFullYear();
const anios = Array.from({ length: 100 }, (_, i) => anioActual - i);

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
      <div className="grupo campos-principales">
        <div className="campo">
          <label htmlFor={`nombres-${numeroPasajero}`}>Nombres*</label>
          <input
            id={`nombres-${numeroPasajero}`}
            type="text"
            placeholder="Nombres*"
            name="nombres"
            value={datos.nombres || ''}
            onChange={handleInput}
          />
        </div>
        <div className="campo">
          <label htmlFor={`apellidos-${numeroPasajero}`}>Apellidos*</label>
          <input
            id={`apellidos-${numeroPasajero}`}
            type="text"
            placeholder="Apellidos*"
            name="apellidos"
            value={datos.apellidos || ''}
            onChange={handleInput}
          />
        </div>
        <div className="campo">
          <label htmlFor={`cedula-${numeroPasajero}`}>Cédula*</label>
          <input
            id={`cedula-${numeroPasajero}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Cédula*"
            name="cedula"
            value={datos.cedula || ''}
            onChange={e => {
              const value = e.target.value.replace(/\D/g, '');
              handleInput({ target: { name: 'cedula', value } });
            }}
          />
        </div>
      </div>
      <div className="grupo-fecha">
        <label>Fecha de nacimiento*</label>
        <div className="fecha">
          <div className="campo">
            <label htmlFor={`dia-${numeroPasajero}`}>Día*</label>
            <select id={`dia-${numeroPasajero}`} name="dia" value={datos.dia || ''} onChange={handleInput}>
              <option value="">Día*</option>
              {dias.map(dia => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor={`mes-${numeroPasajero}`}>Mes*</label>
            <select id={`mes-${numeroPasajero}`} name="mes" value={datos.mes || ''} onChange={handleInput}>
              <option value="">Mes*</option>
              {meses.map((mes, idx) => (
                <option key={mes} value={idx + 1}>{mes}</option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor={`anio-${numeroPasajero}`}>Año*</label>
            <select id={`anio-${numeroPasajero}`} name="anio" value={datos.anio || ''} onChange={handleInput}>
              <option value="">Año*</option>
              {anios.map(anio => (
                <option key={anio} value={anio}>{anio}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {numeroPasajero === 1 && (
        <div className="grupo">
          <div className="campo">
            <label htmlFor={`correo-${numeroPasajero}`}>Correo Electrónico*</label>
            <input
              id={`correo-${numeroPasajero}`}
              type="email"
              placeholder="Correo Electrónico*"
              name="correo"
              value={datos.correo || ''}
              onChange={handleInput}
            />
          </div>
          <div className="campo">
            <label htmlFor={`telefono-${numeroPasajero}`}>Teléfono*</label>
            <input
              id={`telefono-${numeroPasajero}`}
              type="tel"
              placeholder="Teléfono*"
              name="telefono"
              value={datos.telefono || ''}
              onChange={handleInput}
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default PasajerosForm;
