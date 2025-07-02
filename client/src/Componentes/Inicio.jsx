import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Estilos/Inicio.css";
import "./Estilos/Footer.css";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Registro from "./Registro";
import BusEcuador from './Imagenes/BusEcuador.png';
import BusIda from './Imagenes/BusdeIda.png';
import BusVuelta from './Imagenes/Busderegreso.png';
import Calendario from './Imagenes/Calendario.png';
import Personasicon from './Imagenes/Personasicon.png';
import RegistroCooperativa from "./RegistroCooperativa";
import AutocompleteTerminal from '../../../client/src/Componentes/AutocompleteTerminal';
import DatePicker from './DatePicker';
import PasajerosMenu from './PasajerosMenu';
import ModalRastreoBoleto from "./ModalRastreoBoleto";

const Inicio = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Estados para el modal
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const [mostrarRegistroCooperativa, setMostrarRegistroCooperativa] = useState(false);
    const [mostrarModalRastreo, setMostrarModalRastreo] = useState(false);

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
    const [usuario, setUsuario] = useState(() => {
        const saved = localStorage.getItem('usuario');
        return saved ? JSON.parse(saved) : null;
    });
    const [numeroBoleto, setNumeroBoleto] = useState('');
    const [errorRastreo, setErrorRastreo] = useState('');

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
    const handleOrigenChange = (ciudad, terminal) => {
        const nuevoValor = ciudad && terminal ? `${ciudad} (${terminal})` : '';
        setOrigen(nuevoValor);
        setOrigenSeleccionado({ ciudad, terminal });
    };

    const handleDestinoChange = (ciudad, terminal) => {
        const nuevoValor = ciudad && terminal ? `${ciudad} (${terminal})` : '';
        setDestino(nuevoValor);
        setDestinoSeleccionado({ ciudad, terminal });
    };

    const handleLoginExitoso = (usuarioData) => {
        setUsuario(usuarioData);
        setMostrarLogin(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('origenSeleccionado');
        localStorage.removeItem('destinoSeleccionado');
        setUsuario(null);
    };

    const handleBuscar = () => {
        // Validaciones
        if (!origenSeleccionado.ciudad || !origenSeleccionado.terminal) {
            setError('Por favor selecciona un origen válido.');
            return;
        }
        if (!destinoSeleccionado.ciudad || !destinoSeleccionado.terminal) {
            setError('Por favor selecciona un destino válido.');
            return;
        }
        if (!fecha) {
            setError('Por favor selecciona una fecha de viaje.');
            return;
        }
        // Validar que la fecha sea hoy o futura
        const hoy = new Date();
        hoy.setHours(0,0,0,0);

        // Si fecha es 'YYYY-MM-DD', parsea manualmente para evitar problemas de zona horaria
        const [anio, mes, dia] = fecha.split('-').map(Number);
        const fechaSeleccionada = new Date(anio, mes - 1, dia); // Mes empieza en 0
        fechaSeleccionada.setHours(0,0,0,0);

        console.log('Fecha seleccionada:', fechaSeleccionada, 'Hoy:', hoy);

        if (fechaSeleccionada < hoy) {
            setError('La fecha debe ser hoy o una fecha futura.');
            return;
        }
        if (
            origenSeleccionado.ciudad === destinoSeleccionado.ciudad &&
            origenSeleccionado.terminal === destinoSeleccionado.terminal
        ) {
            setError('El origen y destino no pueden ser iguales.');
            return;
        }
        setError('');
        const params = new URLSearchParams({
            origenCiudad: origenSeleccionado.ciudad,
            origenTerminal: origenSeleccionado.terminal,
            destinoCiudad: destinoSeleccionado.ciudad,
            destinoTerminal: destinoSeleccionado.terminal,
            fecha,
            pasajeros: pasajeros.reduce((a, b) => a + b, 0)
        }).toString();
        navigate(`/SeleccionViaje?${params}`);
    };

    return (
        <div className="inicio-container">
            <Header
                currentStep={1}
                totalSteps={5}
                usuario={usuario}
                onLogout={handleLogout}
                onLoginClick={() => setMostrarLogin(true)}
            />
            
            <button
  className="btn-rastrear-boleto"
  onClick={() => setMostrarModalRastreo(true)}
>
  Rastrear boleto
</button>
            <div className="inicio-main-content">
                <div className="formulario-viaje">
                    <div className="tipo-viaje">
                        <span className="ida-activo">
                            <span className="circulo-verde"></span> Ida
                        </span>
                        <span className="subtitulo">
                            Selecciona el origen, fecha de ida y número de pasajeros
                        </span>
                    </div>
                    
                    <div className="contenedor-busqueda">
                        {/* Campo Origen */}
                        <button className="campo-opcion-btn">
                            <img src={BusIda} alt="Origen" />
                            <div>
                                <small>Origen</small><br />
                                <AutocompleteTerminal
                                    value={origen}
                                    onChange={handleOrigenChange}
                                    initialValue={origenSeleccionado}
                                />
                            </div>
                        </button>

                        {/* Campo Destino */}
                        <button className="campo-opcion-btn">
                            <img src={BusVuelta} alt="Destino" />
                            <div>
                                <small>Destino</small><br />
                                <AutocompleteTerminal
                                    value={destino}
                                    onChange={handleDestinoChange}
                                    initialValue={destinoSeleccionado}
                                />
                            </div>
                        </button>

                        {/* Campo Fecha */}
                        <button className="campo-opcion-btn">
                            <img src={Calendario} alt="Fecha" />
                            <div>
                                <small>Ida</small><br />
                                <DatePicker value={fecha} onChange={setFecha} />
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

                <div className="promocion">
                    <div className="promo-img-wrapper">
                        <img src={BusEcuador} alt="Bus" className="promo-img-full" />
                    </div>
                    <div className="promo-info">
                        <h2>¡Cada viaje es una experiencia única<br />hacia tu próximo destino!</h2>
                        <p>Quito, Guayaquil, Manta, Loja, Cuenca, Cayambe y muchos lugares más por conocer</p>
                        <h3>Por trayectos desde</h3>
                        <h1>USD 8</h1>
                        <button className="btn-comprar" onClick={handleBuscar}>
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