import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Estilos/Inicio.css";
import "./Estilos/Footer.css";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Registro from "./Registro";
import PerfilUsuarioModal from "./PerfilUsuarioModal";
import BusIda from './Imagenes/BusdeIda.png';
import BusVuelta from './Imagenes/Busderegreso.png';
import Calendario from './Imagenes/Calendario.png';
import Personasicon from './Imagenes/Personasicon.png';
import RegistroCooperativa from "./RegistroCooperativa";
import AutocompleteTerminal from '../../../client/src/Componentes/AutocompleteTerminal';
import DatePicker from './DatePicker';
import PasajerosMenu from './PasajerosMenu';
import ModalRastreoBoleto from "./ModalRastreoBoleto";
import CarruselImagenes from './CarruselImagenes';
import BusLoader from './BusLoader';
const Inicio = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario, logout } = useAuth();

    // Referencias para los inputs - AGREGAR origenInputRef
    const origenInputRef = useRef(null);
    const destinoInputRef = useRef(null);
    const fechaInputRef = useRef(null);

    // Estados para el modal
    const [mostrandoLoader, setMostrandoLoader] = useState(false);
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const [mostrarRegistroCooperativa, setMostrarRegistroCooperativa] = useState(false);
    const [mostrarModalRastreo, setMostrarModalRastreo] = useState(false);
    const [mostrarPerfil, setMostrarPerfil] = useState(false);

    // Estados para origen y destino
    const [origenSeleccionado, setOrigenSeleccionado] = useState({ ciudad: '', terminal: '' });
    
    const [destinoSeleccionado, setDestinoSeleccionado] = useState({ ciudad: '', terminal: '' });

    // Estados derivados
    const [origen, setOrigen] = useState(
        origenSeleccionado.ciudad && origenSeleccionado.terminal 
            ? `${origenSeleccionado.ciudad} (${origenSeleccionado.terminal})` 
            : ''
    );

    const [destino, setDestino] = useState(
        destinoSeleccionado.ciudad && destinoSeleccionado.terminal 
            ? `${destinoSeleccionado.ciudad} (${destinoSeleccionado.terminal})` 
            : ''
    );

    // Otros estados
    const [fecha, setFecha] = useState('');
    const [mostrarMenuPasajeros, setMostrarMenuPasajeros] = useState(false);
    const [pasajeros, setPasajeros] = useState([1, 0, 0, 0]);
    const [error, setError] = useState('');
    
    // AGREGAR: Estados para animaciones
    const [camposAnimando, setCamposAnimando] = useState({
        origen: false,
        destino: false,
        fecha: false
    });

    // AGREGAR: Estado para animación del botón
    const [botonAnimando, setBotonAnimando] = useState(false);

    // AGREGAR: Estados para el precio mínimo
    const [precioMinimo, setPrecioMinimo] = useState(null);
    const [cargandoPrecio, setCargandoPrecio] = useState(true);

    // Persistir estados
    useEffect(() => {
        localStorage.setItem('origenSeleccionado', JSON.stringify(origenSeleccionado));
        localStorage.setItem('destinoSeleccionado', JSON.stringify(destinoSeleccionado));
        if(usuario) {
            localStorage.setItem('usuario', JSON.stringify(usuario));
        }
    }, [origenSeleccionado, destinoSeleccionado, usuario]);

    // Cargar datos iniciales
    const cargarDatosIniciales = useCallback(() => {
        const params = new URLSearchParams(location.search);
        const origenCiudad = params.get('origenCiudad');
        const origenTerminal = params.get('origenTerminal');
        const destinoCiudad = params.get('destinoCiudad');
        const destinoTerminal = params.get('destinoTerminal');
        const fechaUrl = params.get('fecha');
        const pasajerosUrl = params.get('pasajeros');

        if (origenCiudad && origenTerminal) {
            handleOrigenChange(origenCiudad, origenTerminal);
        }

        if (destinoCiudad && destinoTerminal) {
            handleDestinoChange(destinoCiudad, destinoTerminal);
        }

        if (fechaUrl) setFecha(fechaUrl);
        if (pasajerosUrl) setPasajeros([Number(pasajerosUrl), 0, 0, 0]);
    }, [location.search]);

    useEffect(() => {
        cargarDatosIniciales();
    }, [cargarDatosIniciales]);

    // Manejadores
    const handleOrigenChange = (ciudad, terminalNombre, terminalId) => {
        console.log("handleOrigenChange:", { ciudad, terminalNombre, terminalId });
        setOrigenSeleccionado({
            ciudad,
            terminal: terminalNombre,
            terminalId
        });
        setOrigen(`${ciudad} (${terminalNombre})`);
    };

    const handleDestinoChange = (ciudad, terminalNombre, terminalId) => {
        console.log("handleDestinoChange:", { ciudad, terminalNombre, terminalId });
        setDestinoSeleccionado({
            ciudad,
            terminal: terminalNombre,
            terminalId
        });
        setDestino(`${ciudad} (${terminalNombre})`);
    };

    const handleLoginExitoso = (usuarioData) => {
        // El usuario se actualiza automáticamente a través del AuthContext
        setMostrarLogin(false);
    };

    const handleLogout = () => {
        // Usar el logout del AuthContext que limpia todo
        logout();
        localStorage.removeItem('origenSeleccionado');
        localStorage.removeItem('destinoSeleccionado');
    };

    // NUEVO: Función para animar campos requeridos
    const animarCampoRequerido = (campo) => {
        setCamposAnimando(prev => ({ ...prev, [campo]: true }));
        
        // Quitar la animación después de que termine
        setTimeout(() => {
            setCamposAnimando(prev => ({ ...prev, [campo]: false }));
        }, 2000); // Duración total de las animaciones
    };

    // NUEVO: Función para enfocar campo y animar
    const enfocarYAnimar = (ref, campo) => {
        // Animar el campo
        animarCampoRequerido(campo);
        
        // Enfocar después de un pequeño delay para que se vea la animación
        setTimeout(() => {
            if (ref && ref.current) {
                if (ref.current.focus) {
                    ref.current.focus();
                } else {
                    // Si es un input directo
                    ref.current.focus();
                }
            }
        }, 300);
    };

    // ACTUALIZAR: Función handleBuscar para enviar los IDs de terminal
    const handleBuscar = () => {
        console.log("Validando:", { origenSeleccionado, destinoSeleccionado, fecha });
        // Verificar campos faltantes
        const faltaOrigen = !origenSeleccionado.ciudad || !origenSeleccionado.terminalId;
        const faltaDestino = !destinoSeleccionado.ciudad || !destinoSeleccionado.terminalId;
        const faltaFecha = !fecha;

        // Si faltan campos, animar y enfocar en orden de prioridad
        if (faltaOrigen || faltaDestino || faltaFecha) {
            if (faltaOrigen) {
                setError('Por favor selecciona un origen válido.');
                enfocarYAnimar(origenInputRef, 'origen');
                return;
            }
            if (faltaDestino) {
                setError('Por favor selecciona un destino válido.');
                enfocarYAnimar(destinoInputRef, 'destino');
                return;
            }
            if (faltaFecha) {
                setError('Por favor selecciona una fecha de viaje.');
                enfocarYAnimar(fechaInputRef, 'fecha');
                return;
            }
        }

        // Validar que la fecha sea hoy o futura
        const hoy = new Date();
        hoy.setHours(0,0,0,0);

        const [anio, mes, dia] = fecha.split('-').map(Number);
        const fechaSeleccionada = new Date(anio, mes - 1, dia);
        fechaSeleccionada.setHours(0,0,0,0);

        if (fechaSeleccionada < hoy) {
            setError('La fecha debe ser hoy o una fecha futura.');
            enfocarYAnimar(fechaInputRef, 'fecha');
            return;
        }

        if (
            origenSeleccionado.ciudad === destinoSeleccionado.ciudad &&
            origenSeleccionado.terminalId === destinoSeleccionado.terminalId
        ) {
            setError('El origen y destino no pueden ser iguales.');
            enfocarYAnimar(destinoInputRef, 'destino');
            return;
        }

        setError('');
        setMostrandoLoader(true);

        setTimeout(() => {
            setMostrandoLoader(false);
            const params = new URLSearchParams({
                origenCiudad: origenSeleccionado.ciudad,
                origenTerminal: origenSeleccionado.terminalId, // <-- ID
                destinoCiudad: destinoSeleccionado.ciudad,
                destinoTerminal: destinoSeleccionado.terminalId, // <-- ID
                fecha,
                pasajeros: pasajeros.reduce((a, b) => a + b, 0)
            }).toString();
            navigate(`/SeleccionViaje?${params}`);
        }, 2000);
    };

    // NUEVO: Función para el botón "Compra ya"
    const handleCompraYa = async () => {
        setBotonAnimando(true);
        setTimeout(() => setBotonAnimando(false), 1000);

        setMostrandoLoader(true);

        try {
            const response = await fetch('http://localhost:8000/viajes/precio/min');
            const data = await response.json();

            if (data.success && data.data) {
                const viaje = data.data;
                const params = new URLSearchParams({
                    origenCiudad: viaje.ruta?.terminalOrigen?.ciudad?.nombre || '',
                    origenTerminal: viaje.ruta?.terminalOrigen?.nombre || '',
                    destinoCiudad: viaje.ruta?.terminalDestino?.ciudad?.nombre || '',
                    destinoTerminal: viaje.ruta?.terminalDestino?.nombre || '',
                    fecha: viaje.fecha_salida?.slice(0, 10) || '',
                    pasajeros: 1,
                    viajeId: viaje.id
                }).toString();
                setMostrandoLoader(false);
                navigate(`/SeleccionViaje?${params}`);
            } else {
                setMostrandoLoader(false);
                // Si no hay viaje mínimo, ejecuta búsqueda normal
                handleBuscar();
            }
        } catch (error) {
            setMostrandoLoader(false);
            handleBuscar();
        }
    };

    // NUEVO: useEffect para cargar el precio mínimo
    useEffect(() => {
        const obtenerPrecioMinimo = async () => {
            setCargandoPrecio(true);
            try {
                const response = await fetch('http://localhost:8000/viajes/precio/min');
                const data = await response.json();
                
                if (data.success && data.precioMinimo) {
                    setPrecioMinimo(Number(data.precioMinimo));
                } else {
                    setPrecioMinimo(8.00);
                }
            } catch (error) {
                setPrecioMinimo(8.00);
            } finally {
                setCargandoPrecio(false);
            }
        };

        obtenerPrecioMinimo();
    }, []); // Solo se ejecuta una vez al montar el componente
if (mostrandoLoader) {
    return <BusLoader />;
}

    return (
        
        <div className="inicio-container">
            <Header
                currentStep={1}
                totalSteps={5}
                usuario={usuario}
                onLogout={handleLogout}
                onLoginClick={() => setMostrarLogin(true)}
                onPerfilClick={() => setMostrarPerfil(true)}
            />
            
            <div className="inicio-main-content">
                <div className="formulario-viaje">
                    <div className="tipo-viaje-flex">
                        <div className="tipo-viaje-info">
                            <span className="subtitulo">
                                Selecciona el origen, fecha de ida y número de pasajeros
                            </span>
                        </div>
                        <div className="rastreo-boleto-inline">
                            <span className="rastreo-texto">
                                ¿Ya compraste tu boleto?
                            </span>
                            <button
                                className="btn-rastrear-boleto-mini"
                                onClick={() => setMostrarModalRastreo(true)}
                            >
                                Rastrear boleto
                            </button>
                        </div>
                    </div>
                    
                    <div className="contenedor-busqueda">
                        {/* Campo Origen */}
                        <button 
                            className={`campo-opcion-btn ${
                                camposAnimando.origen ? 'campo-requerido animando' : ''
                            }`}
                        >
                            <img src={BusIda} alt="Origen" />
                            <div>
                                <small>Origen</small><br />
                                <AutocompleteTerminal
                                    ref={origenInputRef}
                                    value={origen}
                                    onChange={handleOrigenChange}
                                    nextInputRef={destinoInputRef}
                                />
                            </div>
                        </button>

                        {/* Campo Destino */}
                        <button 
                            className={`campo-opcion-btn ${
                                camposAnimando.destino ? 'campo-requerido animando' : ''
                            }`}
                        >
                            <img src={BusVuelta} alt="Destino" />
                            <div>
                                <small>Destino</small><br />
                                <AutocompleteTerminal
                                    ref={destinoInputRef}
                                    value={destino}
                                    onChange={handleDestinoChange}
                                    nextInputRef={fechaInputRef}
                                />
                            </div>
                        </button>

                        {/* Campo Fecha */}
                        <button 
                            className={`campo-opcion-btn ${
                                camposAnimando.fecha ? 'campo-requerido animando' : ''
                            }`}
                        >
                            <img src={Calendario} alt="Fecha" />
                            <div>
                                <small>Ida</small><br />
                                <DatePicker 
                                    ref={fechaInputRef}
                                    value={fecha} 
                                    onChange={setFecha} 
                                />
                            </div>
                        </button>

                        {/* Selector de Pasajeros */}
                        <div
                            className="campo-opcion-btn pasajeros"
                            style={{ position: 'relative' }}
                            onClick={() => setMostrarMenuPasajeros(v => !v)}
                        >
                            <img
                                src={Personasicon}
                                alt="Pasajeros"
                                className="icono-personas"
                                style={{ cursor: 'pointer' }}
                            />
                            <div>
                                <small>&nbsp;</small><br />
                                <span className="input-pasajeros" style={{ fontWeight: 600 }}>
                                    {pasajeros.reduce((a, b) => a + b, 0)}
                                </span>
                            </div>
                            {mostrarMenuPasajeros && (
                                <PasajerosMenu
                                    valores={pasajeros}
                                    setValores={setPasajeros}
                                    onConfirmar={() => setMostrarMenuPasajeros(false)}
                                />
                            )}
                        </div>

                        <button className="btn-buscar-estilo" onClick={handleBuscar}>
                            BUSCAR
                        </button>
                    </div>

                    {error && <div className="error-mensaje">{error}</div>}
                </div>

                {/* Publicidad con Carrusel */}
                <div className="promocion">
                    <div className="promo-img-wrapper">
                        <CarruselImagenes intervalo={4000} />
                    </div>
                    <div className="promo-info">
                        <h2>¡Cada viaje es una experiencia única<br />hacia tu próximo destino!</h2>
                        <p>Quito, Guayaquil, Manta, Loja, Cuenca, Cayambe y muchos lugares más por conocer</p>
                        <h3>Por trayectos desde</h3>
                        <h1 className={cargandoPrecio ? 'precio-cargando' : ''}>
                            {cargandoPrecio ? (
                                <span className="precio-loading">
                                    <span className="precio-spinner"></span>
                                    USD --
                                </span>
                            ) : (
                                `USD ${precioMinimo ? precioMinimo.toFixed(2) : '8.00'}`
                            )}
                        </h1>
                        <button 
                            className={`btn-comprar ${botonAnimando ? 'animacion-atencion' : ''}`}
                            onClick={handleCompraYa}
                        >
                            Compra ya
                        </button>
                    </div>
                </div>
            </div>

            {/* Modales */}
            {mostrarLogin && (
                <Login
                    cerrar={() => setMostrarLogin(false)}
                    abrirRegistro={() => {
                        setMostrarLogin(false);
                        setMostrarRegistro(true);
                    }}
                    onLoginExitoso={handleLoginExitoso}
                />
            )}

            {mostrarRegistro && (
                <Registro
                    cerrar={() => setMostrarRegistro(false)}
                    abrirCooperativa={() => {
                        setMostrarRegistro(false);
                        setMostrarRegistroCooperativa(true);
                    }}
                />
            )}

            {mostrarRegistroCooperativa && (
                <RegistroCooperativa cerrar={() => setMostrarRegistroCooperativa(false)} />
            )}

            {/* Modal de Perfil */}
            {mostrarPerfil && (
                <PerfilUsuarioModal
                    cerrar={() => setMostrarPerfil(false)}
                />
            )}

            <ModalRastreoBoleto
                open={mostrarModalRastreo}
                onClose={() => setMostrarModalRastreo(false)}
            />

            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default Inicio;