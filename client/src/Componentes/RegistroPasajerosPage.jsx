import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Header from './Header';
import Footer from './Footer';
import PasajerosForm from './PasajerosForm';
import Login from './Login';
import Registro from './Registro';
import PerfilUsuarioModal from './PerfilUsuarioModal';
import './Estilos/RegistroPasajerosPage.css';
import Button from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const handleAceptar = () => {
    // Validar todos los formularios de pasajeros
    let todosValidos = true;
    
    for (let i = 0; i < numeroPasajeros; i++) {
      const pasajero = datosPasajeros[i];
      
      // Validaciones básicas para todos los pasajeros
      if (!pasajero.nombres || !pasajero.apellidos || !pasajero.cedula || 
          !pasajero.dia || !pasajero.mes || !pasajero.anio) {
        todosValidos = false;
        break;
      }
      
      // Validaciones adicionales para el primer pasajero (titular)
      if (i === 0 && (!pasajero.correo || !pasajero.telefono)) {
        todosValidos = false;
        break;
      }
    }
    
    if (todosValidos) {
      handleRegistroExitoso();
    } else {
      alert('Por favor, complete todos los datos requeridos de todos los pasajeros antes de continuar.');
    }
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
    </div>
  );
};

export default RegistroPasajerosPage;

