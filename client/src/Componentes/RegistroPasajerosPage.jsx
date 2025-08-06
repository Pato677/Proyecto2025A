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

  // Variable de prueba para el número de pasajeros (posteriormente se obtendrá via query)
  // Cambiar este valor para probar con diferentes números de pasajeros
  
  
  // Obtener número de pasajeros de la URL
  const params = new URLSearchParams(location.search);
   // Usar la variable de prueba
  
  // Limpiar localStorage si es una nueva compra (parámetro fresh)
  useEffect(() => {
    const isFreshStart = params.get('fresh') === 'true';
    if (isFreshStart) {
      localStorage.removeItem('pasajerosData');
      localStorage.removeItem('asientosSeleccionados');
      console.log('Nueva compra iniciada - localStorage limpiado');
    }
  }, []);
  
  // Obtener datos de pasajeros existentes desde localStorage
  const datosExistentes = localStorage.getItem('pasajerosData') 
    ? JSON.parse(localStorage.getItem('pasajerosData')) 
    : null;

   const numeroPasajerosPrueba = parseInt(params.get('pasajeros'), 10);
  const pasajeros = numeroPasajerosPrueba; // Usar la variable de prueba
  const viajeIdPrueba = parseInt(params.get('viajeId'), 10); // ID del viaje para pruebas (posteriormente se obtendrá via query)
  // Estado para el formulario actual
  const [formIndex, setFormIndex] = useState(0);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  // Estado para los datos de los pasajeros - usar datos existentes si están disponibles
  const [datosPasajeros, setDatosPasajeros] = useState(() => {
    if (datosExistentes) {
      return datosExistentes;
    }
    
    // Crear array de pasajeros vacío
    const pasajerosVacios = Array.from({ length: pasajeros }, () => ({
      nombres: '',
      apellidos: '',
      cedula: '',
      dia: '',
      mes: '',
      anio: '',
      correo: '',
      telefono: ''
    }));

    // Si hay usuario logueado, prellenar el primer pasajero (titular) con sus datos
    if (usuario && pasajerosVacios.length > 0) {
      console.log('Datos del usuario logueado:', usuario);
      
      // Extraer día, mes y año de fecha_nacimiento si existe
      let dia = '', mes = '', anio = '';
      if (usuario.fecha_nacimiento) {
        const fechaNac = new Date(usuario.fecha_nacimiento);
        dia = fechaNac.getDate().toString();
        mes = (fechaNac.getMonth() + 1).toString();
        anio = fechaNac.getFullYear().toString();
        console.log('Fecha de nacimiento procesada:', { dia, mes, anio });
      }

      pasajerosVacios[0] = {
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        cedula: usuario.cedula || '',
        dia: dia,
        mes: mes,
        anio: anio,
        correo: usuario.correo || '',
        telefono: usuario.telefono || ''
      };
      
      console.log('Datos precargados para el titular:', pasajerosVacios[0]);
    }

    return pasajerosVacios;
  });

  // Esta función se pasará al formulario
  const handleRegistroExitoso = () => {
    // Guardar los datos de los pasajeros en localStorage
    localStorage.setItem('pasajerosData', JSON.stringify(datosPasajeros));
    
    // Pasar solo el ID del viaje por URL
    const params = new URLSearchParams(location.search);
    params.set('viajeId', viajeIdPrueba);
    navigate(`/SeleccionAsientosPage?${params.toString()}`);
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
    
    for (let i = 0; i < pasajeros; i++) {
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
            <PasajerosForm
              ref={formRef}
              key={formIndex}
              numeroPasajero={formIndex + 1}
              datos={datosPasajeros[formIndex]}
              onChange={nuevosDatos => handleChangePasajero(formIndex, nuevosDatos)}
              onRegistroExitoso={handleRegistroExitoso}
            />
            <div className="info-pasajero">
              Pasajero {formIndex + 1} de {pasajeros}
            </div>
          </div>
          <button
            className="pagina-btn flecha-pasajero"
            onClick={() => setFormIndex(formIndex + 1)}
            disabled={formIndex === pasajeros - 1}
            aria-label="Pasajero siguiente"
          >
            <ChevronRight size={28} />
          </button>
        </div>
        <div className="contenedor-botones">
          <Button text="Atras" width='150px' onClick={() => {
            // Guardar datos actuales en localStorage antes de navegar hacia atrás
            localStorage.setItem('pasajerosData', JSON.stringify(datosPasajeros));
            navigate(-1);
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

