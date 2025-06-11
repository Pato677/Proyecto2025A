import React from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
//import "./Estilos/Login.css";

const Login = ({ cerrar, abrirRegistro }) => {

  return (
    <div className="login-overlay" onClick={cerrar}>
      <div className="login-box" onClick={(e) => e.stopPropagation()}>
        <button className="login-close" onClick={cerrar}>×</button>
        <FaSignInAlt className="login-icon" />
        <h2>Iniciar Sesión</h2>

        <div className="login-field">
          <FaUser className="field-icon" />
          <input type="email" placeholder="Ingrese su correo electrónico" />
        </div>

        <div className="login-field">
          <FaLock className="field-icon" />
          <input type="password" placeholder="Ingrese su contraseña" />
        </div>

        <div className="login-buttons">
          <button className="btn-ingresar">INGRESAR</button>
          <button className="btn-admin">Admin</button>
        </div>

        <p className="login-register">
          ¡Si no dispone de una cuenta,{" "}
          <span onClick={abrirRegistro}>click aquí</span>!
        </p>
      </div>
    </div>
  );
};

export default Login;
