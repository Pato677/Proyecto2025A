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

const Inicio = () => {
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const [mostrarRegistroCooperativa, setMostrarRegistroCooperativa] = useState(false);

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
                                <strong>QUITO (UIO)</strong>
                            </div>
                        </button>
                        <button className="campo-opcion-btn">
                            <img src={BusVuelta} alt="Destino" />
                            <div>
                                <small>Destino</small><br />
                                <strong>GUAYAQUIL (GYE)</strong>
                            </div>
                        </button>
                        <button className="campo-opcion-btn">
                            <img src={Calendario} alt="Fecha" />
                            <div>
                                <small>Ida</small><br />
                                <strong>30/04/2025</strong>
                            </div>
                        </button>
                        <div className="campo-opcion-btn pasajeros">
                            <img src={Personasicon} alt="Pasajeros" className="icono-personas" />
                            <div>
                                <small>&nbsp;</small><br />
                                <input type="number" min="1" defaultValue={1} className="input-pasajeros" />
                            </div>
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

            <Footer />
        </div>
    );
};

export default Inicio;