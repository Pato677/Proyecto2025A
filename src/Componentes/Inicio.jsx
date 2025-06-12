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
            {/* Contenido principal */}
            <div className="main-content">
                <Header
                    showSearch={true}
                    showLanguage={true}
                    showUser={true}
                    onLoginClick={() => setMostrarLogin(true)}
                />

                <div className="formulario-viaje">
                    <div className="tipo-viaje">
                        <span className="ida-activo">🟢 Ida</span>
                        <span className="subtitulo">Selecciona el origen, fecha de ida y número de pasajeros</span>
                    </div>

                    <div className="contenedor-busqueda">
                        <div className="campo-opcion">
                            <img src={BusIda} alt="Origen" />
                            <div>
                                <small>Origen</small><br />
                                <strong>QUITO (UIO)</strong>
                            </div>
                        </div>
                        <div className="campo-opcion">
                            <img src={BusVuelta} alt="Destino" />
                            <div>
                                <small>Destino</small><br />
                                <strong>GUAYAQUIL (GYE)</strong>
                            </div>
                        </div>
                        <div className="campo-opcion">
                            <img src={Calendario} alt="Fecha" />
                            <div>
                                <small>Ida</small><br />
                                <strong>30/04/2025</strong>
                            </div>
                        </div>
                        <div className="campo-opcion">
                            <img src={Personasicon} alt="Pasajeros" className="icono-personas" />
                            <div>
                                <input type="number" min="1" defaultValue={1} />
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

                {/* Modales */}
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
            </div>

            {/* Footer fijo abajo */}
            <Footer />
        </div>
    );
};

export default Inicio;
