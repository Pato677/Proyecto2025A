import React, { useState } from "react";
import "./Estilos/Inicio.css";
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
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const [mostrarRegistroCooperativa, setMostrarRegistroCooperativa] = useState(false);
    const [origen, setOrigen] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [mostrarMenuPasajeros, setMostrarMenuPasajeros] = useState(false);
    const [pasajeros, setPasajeros] = useState([1, 0, 0, 0]); // Adultos, Jóvenes, Niños, Bebés

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
                                onChange={(ciudad, terminal) => setOrigen(`${ciudad} (${terminal})`)}
                                />
                            </div>
                        </button>
                        <button className="campo-opcion-btn">
                            <img src={BusVuelta} alt="Destino" />
                            <div>
                                <small>Destino</small><br />
                                <AutocompleteTerminal
                                value={origen}
                                onChange={(ciudad, terminal) => setOrigen(`${ciudad} (${terminal})`)}
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
                      
                        <button className="btn-buscar-estilo">BUSCAR</button>
                    </div>
                </div>

                <div className="promocion">
                    <img src={BusEcuador} alt="Bus" />
                    <div className="promo-info">
                        <h2>¡Cada viaje es una experiencia única<br />hacia tu próximo destino!</h2>
                        <p>Quito, Guayaquil, Manta, Loja, Cuenca, Cayambe y muchos lugares más por conocer</p>
                        <h3>Por trayectos desde</h3>
                        <h1>USD 8</h1>
                        <button className="btn-comprar">Compra ya</button>
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