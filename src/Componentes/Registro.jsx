import React from "react";
import UsuarioCrud from "./ComponentesCRUD/UsuarioCrud";
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

  const [errores, setErrores] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setusuariosState((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar errores cuando se edita
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!usuariosState.nombres.trim()) nuevosErrores.nombres = "Nombres son requeridos";
    if (!usuariosState.apellidos.trim()) nuevosErrores.apellidos = "Apellidos son requeridos";
    if (!usuariosState.fechaNacimiento) nuevosErrores.fechaNacimiento = "Fecha de nacimiento es requerida";
    if (!usuariosState.cedula.trim()) nuevosErrores.cedula = "Cédula es requerida";
    if (!usuariosState.correo.trim()) nuevosErrores.correo = "Correo es requerido";
    else if (!/^\S+@\S+\.\S+$/.test(usuariosState.correo)) nuevosErrores.correo = "Correo no válido";
    if (!usuariosState.telefono.trim()) nuevosErrores.telefono = "Teléfono es requerido";
    if (!usuariosState.contrasena) nuevosErrores.contrasena = "Contraseña es requerida";
    else if (usuariosState.contrasena.length < 6) nuevosErrores.contrasena = "Contraseña debe tener al menos 6 caracteres";
    if (usuariosState.contrasena !== usuariosState.confirmarContrasena) nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    try {
      // Verificar si el correo ya existe
      const correoExiste = await UsuarioCrud.verificarCorreoExistente(usuariosState.correo);
      if (correoExiste) {
        setErrores(prev => ({ ...prev, correo: "Este correo ya está registrado" }));
        return;
      }
      
      // Verificar si la cédula ya existe
      const cedulaExiste = await UsuarioCrud.verificarCedulaExistente(usuariosState.cedula);
      if (cedulaExiste) {
        setErrores(prev => ({ ...prev, cedula: "Esta cédula ya está registrada" }));
        return;
      }
      
      // Crear el usuario
      await UsuarioCrud.crearUsuario({
        nombres: usuariosState.nombres,
        apellidos: usuariosState.apellidos,
        fechaNacimiento: usuariosState.fechaNacimiento,
        cedula: usuariosState.cedula,
        correo: usuariosState.correo,
        telefono: usuariosState.telefono,
        contrasena: usuariosState.contrasena
      });
      
      alert("Registro exitoso");
      cerrar();
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al registrar. Intente nuevamente.");
    }
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
            {errores.nombres && <span className="error-message">{errores.nombres}</span>}
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
            {errores.apellidos && <span className="error-message">{errores.apellidos}</span>}
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
            {errores.fechaNacimiento && <span className="error-message">{errores.fechaNacimiento}</span>}
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
            {errores.cedula && <span className="error-message">{errores.cedula}</span>}
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
            {errores.correo && <span className="error-message">{errores.correo}</span>}
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
            {errores.telefono && <span className="error-message">{errores.telefono}</span>}
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
            {errores.contrasena && <span className="error-message">{errores.contrasena}</span>}
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
            {errores.confirmarContrasena && <span className="error-message">{errores.confirmarContrasena}</span>}
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