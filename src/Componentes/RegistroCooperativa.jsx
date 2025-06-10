import React from "react";
import "./Estilos/Registro.css"; // puedes usar el mismo estilo
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaIdCard,
  FaBuilding,
} from "react-icons/fa";

const RegistroCooperativa = ({ cerrar }) => {
  return (
    <div className="registro-overlay" onClick={cerrar}>
      <div className="registro-box" onClick={(e) => e.stopPropagation()}>
        <button className="registro-close" onClick={cerrar}>×</button>
        <h2>
          <FaBuilding /> Registra tu Compañía
        </h2>

        <form className="registro-form">
          <div>
            <label>Razón social</label>
            <div className="campo">
              <FaUser />
              <input type="text" placeholder="Ingrese la razón social de la empresa" />
            </div>
          </div>

          <div>
            <label>Número de permiso de operación de la compañía</label>
            <div className="campo">
              <FaIdCard />
              <input type="text" placeholder="Ingrese el número de permiso de operación" />
            </div>
          </div>

          <div>
            <label>RUC de la cooperativa</label>
            <div className="campo">
              <FaIdCard />
              <input type="text" placeholder="Ingrese el RUC" />
            </div>
          </div>

          <div>
            <label>Correo electrónico</label>
            <div className="campo">
              <FaEnvelope />
              <input type="email" placeholder="Ingrese su correo electrónico" />
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
          ¡Si desea registrarse de forma individual,{" "}
          <span onClick={cerrar}>click aquí</span>!
        </p>
      </div>
    </div>
  );
};

export default RegistroCooperativa;
