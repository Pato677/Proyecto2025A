import React from 'react';
import './Estilos/PasajeroForm.css';

const dias = Array.from({ length: 31 }, (_, i) => i + 1);
const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const anioActual = new Date().getFullYear();
const anios = Array.from({ length: 100 }, (_, i) => anioActual - i);

const PasajerosForm = React.forwardRef(({
  numeroPasajero = 1,
  datos = {},
  onChange,
  onRegistroExitoso
}, ref) => {
  const [errores, setErrores] = React.useState({});

  React.useImperativeHandle(ref, () => ({
    validar: () => handleSubmit()
  }));

  const handleInput = e => {
    const { name, value } = e.target;
    if (onChange) onChange({ [name]: value });
  };

  const validarCorreo = correo => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const handleSubmit = () => {
    let nuevosErrores = {};

    if (!datos.nombres || datos.nombres.trim() === '') {
      nuevosErrores.nombres = 'El nombre es obligatorio';
    }
    // Validación de apellidos: al menos dos palabras separadas por espacio
    if (
      !datos.apellidos ||
      datos.apellidos.trim() === '' ||
      datos.apellidos.trim().split(' ').length < 2
    ) {
      nuevosErrores.apellidos = 'Debe ingresar al menos dos apellidos separados por espacio';
    }
    if (!datos.cedula || datos.cedula.length !== 10) {
      nuevosErrores.cedula = 'La cédula debe tener 10 dígitos';
    }
    if (!datos.dia) {
      nuevosErrores.dia = 'El día es obligatorio';
    }
    if (!datos.mes) {
      nuevosErrores.mes = 'El mes es obligatorio';
    }
    if (!datos.anio) {
      nuevosErrores.anio = 'El año es obligatorio';
    }

    if (numeroPasajero === 1) {
      if (!datos.correo || !validarCorreo(datos.correo)) {
        nuevosErrores.correo = 'Ingrese un correo válido';
      }
      if (!datos.telefono || datos.telefono.length !== 10) {
        nuevosErrores.telefono = 'El teléfono debe tener 10 dígitos';
      }
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0 && onRegistroExitoso) {
      onRegistroExitoso();
      return true;
    }
    return false;
  };

  return (
    <div className="formulario-pasajero">
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
          {errores.nombres && <span className="error">{errores.nombres}</span>}
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
          {errores.apellidos && <span className="error">{errores.apellidos}</span>}
        </div>
        <div className="campo">
          <label htmlFor={`cedula-${numeroPasajero}`}>Cédula*</label>
          <input
            id={`cedula-${numeroPasajero}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            placeholder="Cédula*"
            name="cedula"
            value={datos.cedula || ''}
            onChange={e => {
              let value = e.target.value.replace(/\D/g, '').slice(0, 10);
              handleInput({ target: { name: 'cedula', value } });
            }}
          />
          {errores.cedula && <span className="error">{errores.cedula}</span>}
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
            {errores.dia && <span className="error">{errores.dia}</span>}
          </div>
          <div className="campo">
            <label htmlFor={`mes-${numeroPasajero}`}>Mes*</label>
            <select id={`mes-${numeroPasajero}`} name="mes" value={datos.mes || ''} onChange={handleInput}>
              <option value="">Mes*</option>
              {meses.map((mes, idx) => (
                <option key={mes} value={idx + 1}>{mes}</option>
              ))}
            </select>
            {errores.mes && <span className="error">{errores.mes}</span>}
          </div>
          <div className="campo">
            <label htmlFor={`anio-${numeroPasajero}`}>Año*</label>
            <select id={`anio-${numeroPasajero}`} name="anio" value={datos.anio || ''} onChange={handleInput}>
              <option value="">Año*</option>
              {anios.map(anio => (
                <option key={anio} value={anio}>{anio}</option>
              ))}
            </select>
            {errores.anio && <span className="error">{errores.anio}</span>}
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
            {errores.correo && <span className="error">{errores.correo}</span>}
          </div>
          <div className="campo">
            <label htmlFor={`telefono-${numeroPasajero}`}>Teléfono*</label>
            <input
              id={`telefono-${numeroPasajero}`}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              placeholder="Teléfono*"
              name="telefono"
              value={datos.telefono || ''}
              onChange={e => {
                let value = e.target.value.replace(/\D/g, '').slice(0, 10);
                handleInput({ target: { name: 'telefono', value } });
              }}
            />
            {errores.telefono && <span className="error">{errores.telefono}</span>}
          </div>
        </div>
      )}
    </div>
  );
});

export default PasajerosForm;
