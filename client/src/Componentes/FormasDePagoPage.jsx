import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './Estilos/FormasDePagoPage.css';
import Header from './Header';
import Footer from './Footer';
import TablaPasajeros from './TablaPasajeros';
import TicketInfo from './Ticket/TicketInfo';
import Button from './Button';
import ConfirmacionCompraModal from './ConfirmacionCompraModal';
import ResultadoCompraModal from './ResultadoCompraModal';
import ErrorModal from './ErrorModal';
import Login from './Login';
import Registro from './Registro';
import PerfilUsuarioModal from './PerfilUsuarioModal';

const FormasDePagoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const params = new URLSearchParams(location.search);
  
  // Función para decodificar datos de pasajeros desde URL
  const decodificarDatosPasajeros = () => {
    const datosEncoded = params.get('datosP');
    if (datosEncoded) {
      try {
        const datosDecoded = decodeURIComponent(datosEncoded);
        return JSON.parse(datosDecoded);
      } catch (error) {
        console.error('Error al decodificar datos de pasajeros:', error);
        return [];
      }
    }
    return [];
  };

  // Función para decodificar asientos seleccionados desde URL
  const decodificarAsientosSeleccionados = () => {
    const asientosEncoded = params.get('asientos');
    if (asientosEncoded) {
      try {
        const asientosDecoded = decodeURIComponent(asientosEncoded);
        return JSON.parse(asientosDecoded);
      } catch (error) {
        console.error('Error al decodificar asientos seleccionados:', error);
        return [];
      }
    }
    return [];
  };
  
  // Estado para la forma de pago seleccionada
  const [formaPagoSeleccionada, setFormaPagoSeleccionada] = useState('');
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [datosViajeReal, setDatosViajeReal] = useState(null);
  const [cargandoViaje, setCargandoViaje] = useState(false);
  
  // Estados para los modales
  const [showConfirmacionModal, setShowConfirmacionModal] = useState(false);
  const [showResultadoModal, setShowResultadoModal] = useState(false);
  const [datosCompraExitosa, setDatosCompraExitosa] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [erroresValidacion, setErroresValidacion] = useState([]);
  const [mostrarErrores, setMostrarErrores] = useState(false);
  
  // Obtener datos desde URL
  const pasajerosData = decodificarDatosPasajeros();
  const asientosSeleccionados = decodificarAsientosSeleccionados();
  
  const viajeId = params.get('viajeId');
  const origenCiudad = params.get('origenCiudad');
  const destinoCiudad = params.get('destinoCiudad');
  const fecha = params.get('fecha');
  
  // Cargar datos del viaje desde el servidor
  useEffect(() => {
    if (viajeId) {
      setCargandoViaje(true);
      // Usar el nuevo endpoint para obtener viaje específico por ID
      axios.get(`http://localhost:8000/viajes/${viajeId}`)
        .then(res => {
          console.log('Respuesta del viaje por ID:', res.data);
          if (res.data.success && res.data.data) {
            setDatosViajeReal(res.data.data);
            console.log('Viaje cargado:', res.data.data);
            console.log('Cooperativa:', res.data.data.ruta?.UsuarioCooperativa?.razon_social);
            console.log('Origen:', res.data.data.ruta?.terminalOrigen?.ciudad?.nombre);
            console.log('Destino:', res.data.data.ruta?.terminalDestino?.ciudad?.nombre);
            console.log('Número unidad:', res.data.data.unidad?.numero_unidad);
          } else {
            console.log('No se pudo cargar el viaje');
          }
        })
        .catch(error => {
          console.error('Error al cargar datos del viaje:', error);
        })
        .finally(() => {
          setCargandoViaje(false);
        });
    }
  }, [viajeId]);
  
  console.log('ID del viaje:', viajeId);
  
  const handleLoginExitoso = (usuarioData) => {
    // El usuario se actualiza automáticamente a través del AuthContext
    setMostrarLogin(false);
  };
  
  // Función para calcular edad
  const calcularEdad = (dia, mes, anio) => {
    const hoy = new Date();
    const fechaNacimiento = new Date(anio, mes - 1, dia);
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    
    if (mesActual < fechaNacimiento.getMonth() || 
        (mesActual === fechaNacimiento.getMonth() && diaActual < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  };
  
  // Preparar datos para los componentes
  const datosViaje = datosViajeReal ? {
    cooperativa: datosViajeReal.ruta?.UsuarioCooperativa?.razon_social || "Transportes Ecuador",
    origen: datosViajeReal.ruta?.terminalOrigen?.ciudad?.nombre || origenCiudad,
    destino: datosViajeReal.ruta?.terminalDestino?.ciudad?.nombre || destinoCiudad,
    fecha: datosViajeReal.fecha_salida || fecha,
    horaSalida: datosViajeReal.fecha_salida ? new Date(datosViajeReal.fecha_salida).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : "13:30",
    horaLlegada: datosViajeReal.fecha_llegada ? new Date(datosViajeReal.fecha_llegada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : "21:30",
    busNumero: datosViajeReal.unidad?.numero_unidad || "Sin asignar",
    precio: parseFloat(datosViajeReal.precio) || 12.25
  } : {
    cooperativa: "Transportes Ecuador",
    origen: origenCiudad,
    destino: destinoCiudad,
    fecha: fecha,
    horaSalida: "13:30",
    horaLlegada: "21:30",
    busNumero: "11",
    precio: 12.25
  };
  
  // Log para debug
  console.log('Datos del viaje para mostrar:', datosViaje);

  // Preparar datos de pasajeros con precios
  const pasajerosConPrecio = pasajerosData.map((pasajero, index) => {
    const edad = calcularEdad(pasajero.dia, pasajero.mes, pasajero.anio);
    const precioBase = datosViaje.precio; // Usar el precio real del viaje
    const esMenor = edad < 18;
    const precio = esMenor ? precioBase / 2 : precioBase;
    
    return {
      ...pasajero,
      asiento: asientosSeleccionados[index] || '',
      edad: edad,
      esMenor: esMenor,
      precio: precio.toFixed(2),
      descripcionPrecio: esMenor ? `${precio.toFixed(2)} (Menor de edad)` : precio.toFixed(2)
    };
  });

  const handleAtras = () => {
    // Crear nueva URL con todos los parámetros necesarios
    const nuevosParams = new URLSearchParams(location.search);
    
    // Codificar datos de pasajeros en la URL
    if (pasajerosData.length > 0) {
      try {
        const datosString = JSON.stringify(pasajerosData);
        const datosEncoded = encodeURIComponent(datosString);
        nuevosParams.set('datosP', datosEncoded);
      } catch (error) {
        console.error('Error al codificar datos de pasajeros:', error);
      }
    }

    // Codificar asientos seleccionados en la URL
    if (asientosSeleccionados.length > 0) {
      try {
        const asientosString = JSON.stringify(asientosSeleccionados);
        const asientosEncoded = encodeURIComponent(asientosString);
        nuevosParams.set('asientos', asientosEncoded);
      } catch (error) {
        console.error('Error al codificar asientos seleccionados:', error);
      }
    }
    
    // Regresar a selección de asientos manteniendo todos los parámetros
    navigate(`/SeleccionAsientosPage?${nuevosParams.toString()}`);
  };

  // Calcular el total de la compra
  const calcularTotalCompra = () => {
    return pasajerosConPrecio.reduce((total, pasajero) => total + parseFloat(pasajero.precio), 0).toFixed(2);
  };

  const handleAceptar = () => {
    const errores = [];

    // Validar que se haya seleccionado una forma de pago
    if (!formaPagoSeleccionada) {
      errores.push({
        pasajero: 1,
        mensaje: 'Por favor, seleccione una forma de pago'
      });
    }

    // Validar que tengamos todos los datos necesarios
    if (!pasajerosData || pasajerosData.length === 0) {
      console.log('Error: No se encontraron datos de pasajeros');
      errores.push({
        pasajero: 1,
        mensaje: 'No se encontraron datos de pasajeros'
      });
    }

    if (!asientosSeleccionados || asientosSeleccionados.length === 0) {
      console.log('Error: No se encontraron asientos seleccionados');
      errores.push({
        pasajero: 1,
        mensaje: 'No se encontraron asientos seleccionados'
      });
    }

    if (!viajeId) {
      console.log('Error: No se encontró el ID del viaje');
      errores.push({
        pasajero: 1,
        mensaje: 'No se encontró el ID del viaje'
      });
    }

    if (errores.length > 0) {
      console.log('Errores de validación encontrados:', errores);
      setErroresValidacion(errores);
      setMostrarErrores(true);
      return;
    }

    // Mostrar modal de confirmación
    setShowConfirmacionModal(true);
  };

  const handleConfirmarCompra = async () => {
    setShowConfirmacionModal(false);
    setProcesandoPago(true);

    try {
      // Preparar datos para enviar al backend
      const datosCompra = {
        pasajeros: pasajerosData,
        asientosSeleccionados: asientosSeleccionados,
        viajeId: viajeId,
        formaPago: formaPagoSeleccionada
      };

      console.log('Enviando datos de compra:', datosCompra);

      // Realizar petición POST al backend
      const response = await axios.post('http://localhost:8000/compras', datosCompra);

      // Manejar respuesta exitosa - verificar tanto success como status code
      if (response.status === 201 && (response.data.success === true || response.data.message === 'Compra creada exitosamente')) {
        const datosRespuesta = response.data.data;
        
        console.log('Datos respuesta del backend:', datosRespuesta);
        console.log('Compra creada exitosamente');
        
        // Agregar información de pasajeros con precios para mostrar en el modal
        const datosCompraCompletos = {
          ...datosRespuesta,
          pasajeros: pasajerosConPrecio
        };
        
        console.log('Datos compra completos:', datosCompraCompletos);
        console.log('ID de compra:', datosCompraCompletos.id);
        
        setDatosCompraExitosa(datosCompraCompletos);
        setShowResultadoModal(true);
      } else {
        // Manejar respuesta no exitosa del backend
        console.log('Error al procesar la compra:', response.data.error || response.data.message || 'Error desconocido');
        console.log('Respuesta completa del servidor:', response.data);
      }

    } catch (error) {
      console.error('Error al procesar la compra:', error);
      
      if (error.response) {
        // Error del servidor
        const errorData = error.response.data;
        const statusCode = error.response.status;
        
        console.log(`Error del servidor (${statusCode}):`, errorData);
        
        // Manejar diferentes tipos de errores del servidor
        if (statusCode === 400) {
          // Errores de validación
          console.log('Error de validación:', errorData.error || 'Datos inválidos');
          if (errorData.asientosOcupados) {
            console.log(`Asientos ocupados: ${errorData.asientosOcupados.join(', ')}`);
            console.log('Se requiere seleccionar otros asientos');
          }
        } else if (statusCode === 404) {
          console.log('Recurso no encontrado:', errorData.error || 'Viaje no encontrado');
        } else if (statusCode === 500) {
          console.log('Error interno del servidor:', errorData.error || errorData.details || 'Error desconocido');
          if (errorData.details) {
            console.log('Detalles del error:', errorData.details);
          }
        } else {
          console.log('Error del servidor:', errorData.error || errorData.message || 'Error desconocido');
        }
      } else if (error.request) {
        // Error de red
        console.log('Error de conexión: No se pudo conectar con el servidor');
        console.log('Verifica tu conexión a internet y que el servidor esté ejecutándose');
      } else {
        // Otro tipo de error
        console.log('Error inesperado al configurar la petición:', error.message);
      }
    } finally {
      setProcesandoPago(false);
    }
  };

  const handleCancelarConfirmacion = () => {
    setShowConfirmacionModal(false);
  };

  const handleCerrarResultado = () => {
    setShowResultadoModal(false);
    setDatosCompraExitosa(null);
    // NO redirigir al home, mantener en la misma página para permitir nuevas compras
    console.log('Modal cerrado');
  };
  return (
    <div className="pago-resumen-page">
      <header >
        <Header 
          currentStep={5} 
          totalSteps={5}
          usuario={usuario}
          onLogout={() => logout()}
          onLoginClick={() => setMostrarLogin(true)}
          onPerfilClick={() => setMostrarPerfil(true)}
        />
      </header>

      <div className="contenido-pago">
        <div>
            <h2 className="titulo-pago">Formas de Pago</h2>

        </div>

        <div className="ticket-info-box">
            {cargandoViaje ? (
              <div>Cargando datos del viaje...</div>
            ) : (
              <TicketInfo datosViaje={datosViaje} />
            )}
        </div>

        {/* Forma de pago */}
        <div className="forma-pago-box">
          <label className='lblFormadepago'>Forma de pago</label>
          <select 
            className='select-forma-pago'
            value={formaPagoSeleccionada}
            onChange={(e) => setFormaPagoSeleccionada(e.target.value)}
          >
            <option value="">Seleccione una opción</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta">Tarjeta de crédito/débito</option>
            <option value="efectivo">Efectivo</option>
          </select>
        </div>
        <div className="tabla-pasajeros-box">
            <TablaPasajeros pasajeros={pasajerosConPrecio} />
        </div>

        {/* Botones */}
        <div className="contenedor-botones">
          <Button text="Atras" width='150px' onClick={handleAtras} />
          <Button 
            text={procesandoPago ? "Procesando..." : "Aceptar"} 
            width='150px' 
            onClick={handleAceptar}
            disabled={procesandoPago}
          />
        </div>
      </div>

      <footer>
        <Footer />
      </footer>

      {/* Modal de Confirmación de Compra */}
      <ConfirmacionCompraModal
        open={showConfirmacionModal}
        onConfirmar={handleConfirmarCompra}
        onCancelar={handleCancelarConfirmacion}
        totalPasajeros={pasajerosConPrecio.length}
        precioTotal={calcularTotalCompra()}
      />

      {/* Modal de Resultado de Compra */}
      <ResultadoCompraModal
        open={showResultadoModal}
        onCerrar={handleCerrarResultado}
        datosCompra={datosCompraExitosa}
        datosViaje={datosViaje}
      />

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

export default FormasDePagoPage;
