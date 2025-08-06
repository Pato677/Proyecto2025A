import React from 'react';
import './Estilos/PasajeroForm.css';

// Validaciones
const validarCedulaEcuatoriana = (cedula) => {
  if (!cedula || cedula.length !== 10) {
    return false;
  }

  // Verificar que solo contenga números
  if (!/^\d{10}$/.test(cedula)) {
    return false;
  }

  // Verificar que los dos primeros dígitos correspondan a una provincia válida (01-24)
  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) {
    return false;
  }

  // Verificar el tercer dígito (debe ser menor a 6 para personas naturales)
  const tercerDigito = parseInt(cedula.charAt(2), 10);
  if (tercerDigito >= 6) {
    return false;
  }

  // Algoritmo del dígito verificador
  const digitoVerificador = parseInt(cedula.charAt(9), 10);
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula.charAt(i), 10) * coeficientes[i];
    if (valor > 9) {
      valor -= 9;
    }
    suma += valor;
  }

  const residuo = suma % 10;
  const digitoCalculado = residuo === 0 ? 0 : 10 - residuo;

  return digitoCalculado === digitoVerificador;
};

const validarCorreo = (correo) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(correo);
};

const validarTelefonoEcuatoriano = (telefono) => {
  if (!telefono || telefono.length !== 10) {
    return false;
  }

  // Verificar que solo contenga números
  if (!/^\d{10}$/.test(telefono)) {
    return false;
  }

  // Verificar que comience con 09 (celular) o con código de área válido para fijo
  const prefijo = telefono.substring(0, 2);
  
  // Celulares empiezan con 09
  if (prefijo === '09') {
    return true;
  }

  // Teléfonos fijos - códigos de área válidos en Ecuador
  const codigosAreaValidos = ['02', '03', '04', '05', '06', '07'];
  return codigosAreaValidos.includes(prefijo);
};

const validarFechaNacimiento = (dia, mes, anio) => {
  if (!dia || !mes || !anio) {
    return false;
  }

  const fecha = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));
  const ahora = new Date();
  
  // Verificar que la fecha sea válida
  if (fecha.getDate() != dia || fecha.getMonth() != mes - 1 || fecha.getFullYear() != anio) {
    return false;
  }

  // Verificar que no sea una fecha futura
  if (fecha > ahora) {
    return false;
  }

  return true;
};

const validarNombres = (nombres) => {
  if (!nombres || nombres.trim() === '') {
    return false;
  }
  
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  return regex.test(nombres.trim()) && nombres.trim().length >= 2;
};

const validarApellidos = (apellidos) => {
  if (!apellidos || apellidos.trim() === '') {
    return false;
  }
  
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  return regex.test(apellidos.trim());
};

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
  const [erroresTiempoReal, setErroresTiempoReal] = React.useState({});

  React.useImperativeHandle(ref, () => ({
    validar: () => handleSubmit()
  }));

  // Validación en tiempo real
  const validarCampo = (name, value) => {
    const nuevosErrores = { ...erroresTiempoReal };
    
    switch (name) {
      case 'nombres':
        if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/.test(value)) {
          nuevosErrores.nombres = 'No se pueden ingresar números en los nombres';
        } else {
          delete nuevosErrores.nombres;
        }
        break;
        
      case 'apellidos':
        if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/.test(value)) {
          nuevosErrores.apellidos = 'No se pueden ingresar números en los apellidos';
        } else {
          delete nuevosErrores.apellidos;
        }
        break;
        
      case 'cedula':
        if (value && !/^\d*$/.test(value)) {
          nuevosErrores.cedula = 'La cédula debe contener solo números';
        } else if (value && value.length > 0 && value.length !== 10) {
          nuevosErrores.cedula = 'La cédula debe tener exactamente 10 dígitos';
        } else {
          delete nuevosErrores.cedula;
        }
        break;
        
      case 'correo':
        if (numeroPasajero === 1 && value && !validarCorreo(value)) {
          nuevosErrores.correo = 'Formato de correo electrónico inválido';
        } else {
          delete nuevosErrores.correo;
        }
        break;
        
      case 'telefono':
        if (numeroPasajero === 1 && value && !/^\d*$/.test(value)) {
          nuevosErrores.telefono = 'El teléfono debe contener solo números';
        } else if (numeroPasajero === 1 && value && value.length > 0 && value.length !== 10) {
          nuevosErrores.telefono = 'El teléfono debe tener exactamente 10 dígitos';
        } else {
          delete nuevosErrores.telefono;
        }
        break;
        
      default:
        break;
    }
    
    setErroresTiempoReal(nuevosErrores);
  };

  const handleInput = e => {
    const { name, value } = e.target;
    validarCampo(name, value);
    if (onChange) onChange({ [name]: value });
  };

  const validarCorreo = correo => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const handleSubmit = () => {
    let nuevosErrores = {};

    // Validar nombres
    if (!validarNombres(datos.nombres)) {
      nuevosErrores.nombres = 'Los nombres son obligatorios y deben contener solo letras';
    }
    
    // Validar apellidos
    if (!validarApellidos(datos.apellidos)) {
      nuevosErrores.apellidos = 'Los apellidos son obligatorios y deben contener solo letras';
    }
    
    // Validar cédula
    if (!validarCedulaEcuatoriana(datos.cedula)) {
      nuevosErrores.cedula = 'La cédula ecuatoriana ingresada no es válida';
    }
    
    // Validar fecha de nacimiento
    if (!validarFechaNacimiento(datos.dia, datos.mes, datos.anio)) {
      nuevosErrores.anio = 'La fecha de nacimiento no es válida o no puede ser una fecha futura';
    }

    // Validaciones adicionales para el titular (primer pasajero)
    if (numeroPasajero === 1) {
      if (!validarCorreo(datos.correo)) {
        nuevosErrores.correo = 'El correo electrónico no tiene un formato válido';
      }
      
      if (!validarTelefonoEcuatoriano(datos.telefono)) {
        nuevosErrores.telefono = 'El teléfono debe ser un número ecuatoriano válido (10 dígitos)';
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
            onChange={e => {
              // Solo permitir letras, espacios y caracteres acentuados
              let value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
              validarCampo('nombres', value);
              if (onChange) onChange({ nombres: value });
            }}
            className={erroresTiempoReal.nombres || errores.nombres ? 'input-error' : ''}
          />
          {erroresTiempoReal.nombres && <span className="error-tiempo-real">{erroresTiempoReal.nombres}</span>}
          {errores.nombres && !erroresTiempoReal.nombres && <span className="error">{errores.nombres}</span>}
        </div>
        <div className="campo">
          <label htmlFor={`apellidos-${numeroPasajero}`}>Apellidos*</label>
          <input
            id={`apellidos-${numeroPasajero}`}
            type="text"
            placeholder="Apellidos*"
            name="apellidos"
            value={datos.apellidos || ''}
            onChange={e => {
              // Solo permitir letras, espacios y caracteres acentuados
              let value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
              validarCampo('apellidos', value);
              if (onChange) onChange({ apellidos: value });
            }}
            className={erroresTiempoReal.apellidos || errores.apellidos ? 'input-error' : ''}
          />
          {erroresTiempoReal.apellidos && <span className="error-tiempo-real">{erroresTiempoReal.apellidos}</span>}
          {errores.apellidos && !erroresTiempoReal.apellidos && <span className="error">{errores.apellidos}</span>}
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
              validarCampo('cedula', value);
              if (onChange) onChange({ cedula: value });
            }}
            className={erroresTiempoReal.cedula || errores.cedula ? 'input-error' : ''}
          />
          {erroresTiempoReal.cedula && <span className="error-tiempo-real">{erroresTiempoReal.cedula}</span>}
          {errores.cedula && !erroresTiempoReal.cedula && <span className="error">{errores.cedula}</span>}
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
              onChange={e => {
                validarCampo('correo', e.target.value);
                if (onChange) onChange({ correo: e.target.value });
              }}
              className={erroresTiempoReal.correo || errores.correo ? 'input-error' : ''}
            />
            {erroresTiempoReal.correo && <span className="error-tiempo-real">{erroresTiempoReal.correo}</span>}
            {errores.correo && !erroresTiempoReal.correo && <span className="error">{errores.correo}</span>}
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
                validarCampo('telefono', value);
                if (onChange) onChange({ telefono: value });
              }}
              className={erroresTiempoReal.telefono || errores.telefono ? 'input-error' : ''}
            />
            {erroresTiempoReal.telefono && <span className="error-tiempo-real">{erroresTiempoReal.telefono}</span>}
            {errores.telefono && !erroresTiempoReal.telefono && <span className="error">{errores.telefono}</span>}
          </div>
        </div>
      )}
    </div>
  );
});

export default PasajerosForm;
