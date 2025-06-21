import React from "react";
import axios from "axios";
import { FaUser, FaCalendarAlt, FaIdCard, FaEnvelope, FaPhoneAlt, FaLock } from "react-icons/fa";

const Registro = ({ cerrar, abrirCooperativa }) => {
  const [usuariosState, setusuariosState] = React.useState({
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    cedula: "",
    correo: "",
    telefono: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setusuariosState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  if (usuariosState.contrasena !== usuariosState.confirmarContrasena) {
    alert("Las contraseñas no coinciden");
    return;
  }

  axios.post("http://localhost:3000/UsuarioPasajero", usuariosState)
    .then((response) => {
      console.log("Registro exitoso:", response.data);
      alert("Registro exitoso");
      cerrar();
    })
    .catch((error) => {
      console.error("Error al registrar:", error);
      alert("Error al registrar. Intente nuevamente.");
    });
};

  return (
    <div className="registro-overlay" onClick={cerrar}>
      <div className="registro-box" onClick={(e) => e.stopPropagation()}>
        <button className="registro-close" onClick={cerrar}>×</button>
        <h2>Formulario de Registro</h2>

        <form className="registro-form" onSubmit={handleSubmit}>
          <div>
            <label>Nombres</label>
            <div className="campo">
              <FaUser />
              <input
                type="text"
                name="nombres"
                placeholder="Ingrese su nombre completo"
                value={usuariosState.nombres}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label>Apellidos</label>
            <div className="campo">
              <FaUser />
              <input
                type="text"
                name="apellidos"
                placeholder="Ingrese sus apellidos"
                value={usuariosState.apellidos}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label>Fecha de nacimiento</label>
            <div className="campo">
              <FaCalendarAlt />
              <input
                type="date"
                name="fechaNacimiento"
                value={usuariosState.fechaNacimiento}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label>Número de cédula</label>
            <div className="campo">
              <FaIdCard />
              <input
                type="text"
                name="cedula"
                placeholder="Ingrese su número de cédula"
                value={usuariosState.cedula}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label>Correo electrónico</label>
            <div className="campo">
              <FaEnvelope />
              <input
                type="email"
                name="correo"
                placeholder="Ingrese su correo electrónico"
                value={usuariosState.correo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label>Número de teléfono</label>
            <div className="campo">
              <FaPhoneAlt />
              <input
                type="tel"
                name="telefono"
                placeholder="Ingrese su número"
                value={usuariosState.telefono}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label>Contraseña</label>
            <div className="campo">
              <FaLock />
              <input
                type="password"
                name="contrasena"
                placeholder="Ingrese su contraseña"
                value={usuariosState.contrasena}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label>Confirmar contraseña</label>
            <div className="campo">
              <FaLock />
              <input
                type="password"
                name="confirmarContrasena"
                placeholder="Confirme su contraseña"
                value={usuariosState.confirmarContrasena}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-registrarse">REGISTRARSE</button>
        </form>

        <p className="registro-link">
          ¡Si desea aplicar como cooperativa,{" "}
          <span onClick={abrirCooperativa}>click aquí</span>!
        </p>
      </div>
    </div>
  );
};

export default Registro;
