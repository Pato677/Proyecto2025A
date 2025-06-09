import "./Inicio.css";
import { useNavigate } from "react-router-dom";
import Logo from './Imagenes/Logo.png';
import BusEcuador from './Imagenes/BusEcuador.png';
import BusIda from './Imagenes/BusdeIda.png';
import BusVuelta from './Imagenes/Busderegreso.png';
import Calendario from './Imagenes/Calendario.png';
import Personasicon from './Imagenes/Personasicon.png';
import { FaSearch, FaGlobe, FaUserCircle } from "react-icons/fa";

const Inicio = () => {
    const navigate = useNavigate();

    return (
        <div className="inicio-container">
            <header className="header">
                <div className="logo">
                    <img src={Logo} alt="Logo" />

                </div>
                <nav className="nav">
                    <div className="nav-item">
                        <FaSearch className="icon" />
                        <span className="link-simulado">Buscar viaje</span>
                    </div>

                    <div className="nav-item">
                        <FaGlobe className="icon" />
                        <span>Español</span>
                    </div>

                    <div className="nav-item">
                        <FaUserCircle className="icon" />
                        <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
                    </div>
                </nav>
            </header>


            <div className="formulario-viaje">
                <div className="tipo-viaje">
                    <span className="boton-ida">
                        <span className="icono-circulo"></span>
                        <strong>Ida</strong>
                    </span>
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
                    <h4>Por trayectos desde</h4>
                    <h1>USD 8</h1>
                    <button className="btn-comprar">Compra ya</button>
                </div>

            </div>


            <footer className="footer">
                <p>© 2025 Todos los derechos reservados.</p>
                <p>Av. Eloy Alfaro y República, Quito, Ecuador</p>
                <p>contacto@transportesec.com | Tel: +593 2 600 1234</p>
            </footer>
        </div>
    );
};

export default Inicio;
