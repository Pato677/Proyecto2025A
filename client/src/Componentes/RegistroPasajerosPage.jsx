import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Header from './Header';
import Footer from './Footer';
import PasajerosForm from './PasajerosForm';
import Login from './Login';
import Registro from './Registro';
import PerfilUsuarioModal from './PerfilUsuarioModal';
import ErrorModal from './ErrorModal';
import './Estilos/RegistroPasajerosPage.css';
import Button from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const RegistroPasajerosPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuth();
  const formRef = useRef();

  // Obtener parámetros de la URL
  const params = new URLSearchParams(location.search);
  const numeroPasajeros = parseInt(params.get('pasajeros'), 10);
  const viajeId = parseInt(params.get('viajeId'), 10);

  // Función para decodificar datos de pasajeros desde URL
  const decodificarDatosPasajeros = () => {
    const datosEncoded = params.get('datosP');
    if (datosEncoded) {
      try {
        const datosDecoded = decodeURIComponent(datosEncoded);
        return JSON.parse(datosDecoded);
      } catch (error) {
        console.error('Error al decodificar datos de pasajeros:', error);
        return null;
      }
    }
    return null;
  };

  // Función para codificar datos de pasajeros para URL
  const codificarDatosPasajeros = (datos) => {
    try {
      const datosString = JSON.stringify(datos);
      return encodeURIComponent(datosString);
    } catch (error) {
      console.error('Error al codificar datos de pasajeros:', error);
      return '';
    }
  };
  // Estado para el formulario actual
  const [formIndex, setFormIndex] = useState(0);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [erroresValidacion, setErroresValidacion] = useState([]);
  const [mostrarErrores, setMostrarErrores] = useState(false);

  // Estado para los datos de los pasajeros - usar datos de URL si están disponibles
  const [datosPasajeros, setDatosPasajeros] = useState(() => {
    const datosDeURL = decodificarDatosPasajeros();
    if (datosDeURL && datosDeURL.length === numeroPasajeros) {
      console.log('Datos de pasajeros cargados desde URL:', datosDeURL);
      return datosDeURL;
    }
    
    // Crear array de pasajeros vacío
    const pasajerosVacios = Array.from({ length: numeroPasajeros }, () => ({
      nombres: '',
      apellidos: '',
      cedula: '',
      dia: '',
      mes: '',
      anio: '',
      correo: '',
      telefono: ''
    }));

    console.log('Iniciando con datos vacíos para', numeroPasajeros, 'pasajeros');
    return pasajerosVacios;
  });

  // Función para cargar los datos del usuario en el titular
  const cargarDatosUsuario = () => {
    if (!usuario) return;
    
    console.log('Cargando datos del usuario logueado:', usuario);
    
    // Extraer día, mes y año de fecha_nacimiento si existe
    let dia = '', mes = '', anio = '';
    if (usuario.fecha_nacimiento) {
      const fechaNac = new Date(usuario.fecha_nacimiento);
      dia = fechaNac.getDate().toString();
      mes = (fechaNac.getMonth() + 1).toString();
      anio = fechaNac.getFullYear().toString();
      console.log('Fecha de nacimiento procesada:', { dia, mes, anio });
    }

    const datosUsuario = {
      nombres: usuario.nombres || '',
      apellidos: usuario.apellidos || '',
      cedula: usuario.cedula || '',
      dia: dia,
      mes: mes,
      anio: anio,
      correo: usuario.correo || '',
      telefono: usuario.telefono || ''
    };

    // Actualizar solo el primer pasajero (titular)
    setDatosPasajeros(prev => 
      prev.map((pasajero, index) => 
        index === 0 ? datosUsuario : pasajero
      )
    );
    
    console.log('Datos cargados para el titular:', datosUsuario);
  };

  // Esta función navegará con los datos en la URL
  const handleRegistroExitoso = () => {
    console.log('Navegando a selección de asientos con datos:', datosPasajeros);
    
    // Crear nueva URL con todos los parámetros necesarios
    const nuevosParams = new URLSearchParams();
    nuevosParams.set('viajeId', viajeId.toString());
    nuevosParams.set('pasajeros', numeroPasajeros.toString());
    
    // Codificar datos de pasajeros en la URL
    const datosEncoded = codificarDatosPasajeros(datosPasajeros);
    if (datosEncoded) {
      nuevosParams.set('datosP', datosEncoded);
    }
    
    navigate(`/SeleccionAsientosPage?${nuevosParams.toString()}`);
  };

  const handleLoginExitoso = (usuarioData) => {
    // El usuario se actualiza automáticamente a través del AuthContext
    setMostrarLogin(false);
  };

  // Función para actualizar los datos de un pasajero
  const handleChangePasajero = (index, nuevosDatos) => {
    setDatosPasajeros(prev =>
      prev.map((p, i) => (i === index ? { ...p, ...nuevosDatos } : p))
    );
  };

  // Función para validar todos los pasajeros
  const validarTodosPasajeros = () => {
    const errores = [];
    
    for (let i = 0; i < numeroPasajeros; i++) {
      const pasajero = datosPasajeros[i];
      const numeroPasajero = i + 1;
      
      // Validar nombres
      if (!validarNombres(pasajero.nombres)) {
        errores.push({
          pasajero: numeroPasajero,
          mensaje: 'Los nombres son obligatorios y deben contener solo letras'
        });
      }
      
      // Validar apellidos
      if (!validarApellidos(pasajero.apellidos)) {
        errores.push({
          pasajero: numeroPasajero,
          mensaje: 'Los apellidos son obligatorios y deben contener solo letras'
        });
      }
      
      // Validar cédula
      if (!validarCedulaEcuatoriana(pasajero.cedula)) {
        errores.push({
          pasajero: numeroPasajero,
          mensaje: 'La cédula ecuatoriana ingresada no es válida'
        });
      }
      
      // Validar fecha de nacimiento
      if (!validarFechaNacimiento(pasajero.dia, pasajero.mes, pasajero.anio)) {
        errores.push({
          pasajero: numeroPasajero,
          mensaje: 'La fecha de nacimiento no es válida o no puede ser una fecha futura'
        });
      }
      
      // Validaciones adicionales para el primer pasajero (titular)
      if (i === 0) {
        if (!validarCorreo(pasajero.correo)) {
          errores.push({
            pasajero: numeroPasajero,
            mensaje: 'El correo electrónico no tiene un formato válido'
          });
        }
        
        if (!validarTelefonoEcuatoriano(pasajero.telefono)) {
          errores.push({
            pasajero: numeroPasajero,
            mensaje: 'El teléfono debe tener 10 dígitos y ser un número ecuatoriano válido (celular: 09xxxxxxxx o fijo con código de área válido)'
          });
        }
      }
    }
    
    return errores;
  };

  const handleAceptar = () => {
    const errores = validarTodosPasajeros();
    
    if (errores.length > 0) {
      console.log('Errores de validación encontrados:', errores);
      setErroresValidacion(errores);
      setMostrarErrores(true);
      return;
    }
    
    console.log('Todos los datos son válidos, procediendo con la compra...');
    handleRegistroExitoso();
  };

  return (
    <div className="registro-pasajeros-page">
      <header>
        <Header 
          currentStep={3} 
          totalSteps={5}
          usuario={usuario}
          onLogout={() => logout()}
          onLoginClick={() => setMostrarLogin(true)}
          onPerfilClick={() => setMostrarPerfil(true)}
        />
      </header>
      <main className="contenido-pasajeros">
        <h2 className="titulo-pasajeros">Pasajeros</h2>
        <p className="subtitulo">
          Ingrese los datos de cada pasajero tal y como aparecen en el pasaporte o documento de identidad
        </p>
        <div className="contenedor-formulario">
          <button
            className="pagina-btn flecha-pasajero"
            onClick={() => setFormIndex(formIndex - 1)}
            disabled={formIndex === 0}
            aria-label="Pasajero anterior"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="formulario-pasajero">
            {/* Botón para cargar datos del usuario solo si está logueado y es el titular */}
            {usuario && formIndex === 0 && (
              <div className="cargar-datos-usuario">
                <Button 
                  text="Cargar mis datos" 
                  width="180px" 
                  onClick={cargarDatosUsuario}
                  style={{ marginBottom: '10px' }}
                />
              </div>
            )}
            <PasajerosForm
              ref={formRef}
              key={formIndex}
              numeroPasajero={formIndex + 1}
              datos={datosPasajeros[formIndex]}
              onChange={nuevosDatos => handleChangePasajero(formIndex, nuevosDatos)}
              onRegistroExitoso={handleRegistroExitoso}
            />
            <div className="info-pasajero">
              Pasajero {formIndex + 1} de {numeroPasajeros}
            </div>
          </div>
          <button
            className="pagina-btn flecha-pasajero"
            onClick={() => setFormIndex(formIndex + 1)}
            disabled={formIndex === numeroPasajeros - 1}
            aria-label="Pasajero siguiente"
          >
            <ChevronRight size={28} />
          </button>
        </div>
        <div className="contenedor-botones">
          <Button text="Atras" width='150px' onClick={() => {
            // Navegar hacia atrás manteniendo los datos actuales en la URL
            const nuevosParams = new URLSearchParams(location.search);
            const datosEncoded = codificarDatosPasajeros(datosPasajeros);
            if (datosEncoded) {
              nuevosParams.set('datosP', datosEncoded);
            }
            
            // Navegar específicamente a la página de resultados con todos los parámetros preservados
            navigate(`/ResultadosBusquedaPage?${nuevosParams.toString()}`);
          }} />
          <Button text="Aceptar" width='150px' onClick={handleAceptar} />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>

      {/* Modal de Login */}
      {mostrarLogin && (
        <Login
          cerrar={() => setMostrarLogin(false)}
          abrirRegistro={() => {
            setMostrarLogin(false);
            setMostrarRegistro(true);
          }}
          onLoginExitoso={handleLoginExitoso}
          shouldRedirect={false}
        />
      )}

      {/* Modal de Registro */}
      {mostrarRegistro && (
        <Registro
          cerrar={() => setMostrarRegistro(false)}
          abrirCooperativa={() => {
            setMostrarRegistro(false);
            // Aquí podrías agregar lógica para abrir modal de cooperativa si es necesario
          }}
        />
      )}

      {/* Modal de Perfil */}
      {mostrarPerfil && (
        <PerfilUsuarioModal
          cerrar={() => setMostrarPerfil(false)}
        />
      )}

      {/* Modal de Errores */}
      {mostrarErrores && (
        <ErrorModal
          errores={erroresValidacion}
          cerrar={() => setMostrarErrores(false)}
        />
      )}
    </div>
  );
};

export default RegistroPasajerosPage;

