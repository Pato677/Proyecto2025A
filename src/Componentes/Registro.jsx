import React from "react";
import "./Estilos/Registro.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCalendarAlt,
  FaPhoneAlt,
  FaIdCard,
} from "react-icons/fa";
import axios from "axios";


const Registro = ({ cerrar, abrirCooperativa }) => {


  
  return (
    <div className="registro-overlay" onClick={cerrar}>
      <div className="registro-box" onClick={(e) => e.stopPropagation()}>
        <button className="registro-close" onClick={cerrar}>×</button>
        <h2>Formulario de Registro</h2>

        <form className="registro-form">
          <div>
            <label>Nombres</label>
            <div className="campo">
              <FaUser />
              <input type="text" placeholder="Ingrese su nombre completo" />
            </div>
          </div>

          <div>
            <label>Apellidos</label>
            <div className="campo">
              <FaUser />
              <input type="text" placeholder="Ingrese sus apellidos" />
            </div>
          </div>

          <div>
            <label>Fecha de nacimiento</label>
            <div className="campo">
              <FaCalendarAlt />
              <input type="date" placeholder="dd/mm/yy" />
            </div>
          </div>

          <div>
            <label>Número de cédula</label>
            <div className="campo">
              <FaIdCard />
              <input type="text" placeholder="Ingrese su número de cédula" />
            </div>
          </div>

          <div>
            <label>Correo electrónico</label>
            <div className="campo">
              <FaEnvelope />
              <input
                type="email"
                placeholder="Ingrese su correo electrónico"
              />
            </div>
          </div>

          <div>
            <label>Número de teléfono</label>
            <div className="campo">
              <FaPhoneAlt />
              <input type="tel" placeholder="Ingrese su número" />
            </div>
          </div>

          <div>
            <label>Contraseña</label>
            <div className="campo">
              <FaLock />
              <input type="password" placeholder="Ingrese su contraseña" />
            </div>
          </div>

          <div>
            <label>Confirmar contraseña</label>
            <div className="campo">
              <FaLock />
              <input type="password" placeholder="Confirme su contraseña" />
            </div>
          </div>
        </form>

        <button className="btn-registrarse">REGISTRARSE</button>

          <p className="registro-link">
          ¡Si desea aplicar como cooperativa,{" "}
          <span onClick={abrirCooperativa}>click aquí</span>!
        </p>
      </div>
    </div>
  );
};

export default Registro;
