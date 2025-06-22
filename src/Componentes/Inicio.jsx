import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Estilos/Inicio.css";
import "./Estilos/Footer.css"
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
import AutocompleteTerminal from './AutocompleteTerminal';
import DatePicker from './DatePicker';
import PasajerosMenu from './PasajerosMenu';

const Inicio = () => {
    const navigate = useNavigate();
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const [mostrarRegistroCooperativa, setMostrarRegistroCooperativa] = useState(false);
    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const [origenSeleccionado, setOrigenSeleccionado] = useState({ ciudad: '', terminal: '' });
    const [destinoSeleccionado, setDestinoSeleccionado] = useState({ ciudad: '', terminal: '' });
    const [fecha, setFecha] = useState('');
    const [mostrarMenuPasajeros, setMostrarMenuPasajeros] = useState(false);
    const [pasajeros, setPasajeros] = useState([1, 0, 0, 0]); // Adultos, Jóvenes, Niños, Bebés
    const [error, setError] = useState('');

    const handleOrigenChange = (ciudad, terminal) => {
        setOrigen(ciudad && terminal ? `${ciudad} (${terminal})` : '');
        setOrigenSeleccionado({ ciudad, terminal });
    };

    const handleDestinoChange = (ciudad, terminal) => {
        setDestino(ciudad && terminal ? `${ciudad} (${terminal})` : '');
        setDestinoSeleccionado({ ciudad, terminal });
    };

    const handleBuscar = () => {
        let mensaje = '';
        // Obtén la fecha de hoy en formato yyyy-mm-dd
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        const hoyStr = `${yyyy}-${mm}-${dd}`;

        if (!origenSeleccionado.ciudad && !destinoSeleccionado.ciudad) {
            mensaje = 'Debe seleccionar una terminal de origen y una de destino.';
        } else if (!origenSeleccionado.ciudad) {
            mensaje = 'Debe seleccionar una terminal de origen.';
        } else if (!destinoSeleccionado.ciudad) {
            mensaje = 'Debe seleccionar una terminal de destino.';
        } else if (
            origenSeleccionado.ciudad === destinoSeleccionado.ciudad &&
            origenSeleccionado.terminal === destinoSeleccionado.terminal
        ) {
            mensaje = 'El origen y el destino deben ser diferentes.';
        } else if (!fecha) {
            mensaje = 'Debe seleccionar una fecha de viaje.';
        } else if (fecha < hoyStr) {
            mensaje = 'La fecha de viaje debe ser igual o mayor al día de hoy.';
        }

        setError(mensaje);
        if (mensaje) return;

        // Si pasa todas las validaciones, navega a SeleccionViaje
        navigate('/SeleccionViaje', {
            state: {
                origen: origenSeleccionado,
                destino: destinoSeleccionado,
                fecha,
                pasajeros
            }
        });
    };

    return (
        <div className="inicio-container">
            <Header
                showSearch={true}
                showLanguage={true}
                showUser={true}
                onLoginClick={() => setMostrarLogin(true)}
                currentStep={1} totalSteps={5}
            />

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
                        <button className="campo-opcion-btn">
                            <img src={BusIda} alt="Origen" />
                            <div>
                                <small>Origen</small><br />
                                <AutocompleteTerminal
                                    value={origen}
                                    onChange={handleOrigenChange}
                                />
                            </div>
                        </button>
                        <button className="campo-opcion-btn">
                            <img src={BusVuelta} alt="Destino" />
                            <div>
                                <small>Destino</small><br />
                                <AutocompleteTerminal
                                    value={destino}
                                    onChange={handleDestinoChange}
                                />
                            </div>
                        </button>
                        <button className="campo-opcion-btn">
                            <img src={Calendario} alt="Fecha" />
                            <div>
                                <small>Ida</small><br />
                                <DatePicker value={fecha} onChange={setFecha} />
                            </div>
                        </button>
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
                        <button className="btn-buscar-estilo" onClick={handleBuscar}>BUSCAR</button>
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
                        <button
                            className="btn-comprar"
                            onClick={() => {
                                //Aqui se debería redirigir a la página de ofertas
                                handleBuscar();
                                    }
                                }
                        >
                        
                            Compra ya
                        </button>
                    </div>
                </div>
            </div>

            {mostrarLogin && (
                <Login
                    cerrar={() => setMostrarLogin(false)}
                    abrirRegistro={() => {
                        setMostrarLogin(false);
                        setMostrarRegistro(true);
                    }}
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
            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default Inicio;