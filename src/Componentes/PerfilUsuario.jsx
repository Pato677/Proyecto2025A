import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioCrud from "./ComponentesCRUD/UsuarioCrud";
import './Estilos/PerfilUsuario.css';
import { 
  FaUser, FaCalendarAlt, FaIdCard, 
  FaEnvelope, FaPhoneAlt, FaLock, 
  FaSave, FaTrash, FaArrowLeft 
} from "react-icons/fa";

const PerfilUsuario = () => {
  const navigate = useNavigate();
  const [usuarioState, setUsuarioState] = useState({
    id: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    cedula: "",
    correo: "",
    telefono: "",
    contrasena: "",
    confirmarContrasena: ""
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const usuarioStorage = JSON.parse(localStorage.getItem('usuario'));
        if (!usuarioStorage || !usuarioStorage.id) {
          navigate('/Inicio');
          return;
        }

        const usuario = await UsuarioCrud.obtenerUsuarioPorId(usuarioStorage.id);
        if (usuario) {
          setUsuarioState({
            id: usuario.id,
            nombres: usuario.nombres || "",
            apellidos: usuario.apellidos || "",
            fechaNacimiento: usuario.fechaNacimiento || "",
            cedula: usuario.cedula || "",
            correo: usuario.correo || "",
            telefono: usuario.telefono || "",
            contrasena: "",
            confirmarContrasena: ""
          });
        } else {
          navigate('/Inicio');
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        navigate('/Inicio');
      }
    };

    cargarUsuario();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuarioState(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!usuarioState.nombres.trim()) nuevosErrores.nombres = "Nombres son requeridos";
    if (!usuarioState.apellidos.trim()) nuevosErrores.apellidos = "Apellidos son requeridos";
    if (!usuarioState.fechaNacimiento) nuevosErrores.fechaNacimiento = "Fecha de nacimiento es requerida";
    if (!usuarioState.cedula.trim()) nuevosErrores.cedula = "Cédula es requerida";
    if (!usuarioState.correo.trim()) nuevosErrores.correo = "Correo es requerido";
    else if (!/^\S+@\S+\.\S+$/.test(usuarioState.correo)) nuevosErrores.correo = "Correo no válido";
    if (!usuarioState.telefono.trim()) nuevosErrores.telefono = "Teléfono es requerido";

    if (usuarioState.contrasena || usuarioState.confirmarContrasena) {
      if (usuarioState.contrasena.length < 6) nuevosErrores.contrasena = "Contraseña debe tener al menos 6 caracteres";
      if (usuarioState.contrasena !== usuarioState.confirmarContrasena) nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    try {
      const datosActualizacion = {
        nombres: usuarioState.nombres,
        apellidos: usuarioState.apellidos,
        fechaNacimiento: usuarioState.fechaNacimiento,
        cedula: usuarioState.cedula,
        correo: usuarioState.correo,
        telefono: usuarioState.telefono
      };

      if (usuarioState.contrasena) {
        datosActualizacion.contrasena = usuarioState.contrasena;
      }

      await UsuarioCrud.actualizarUsuario(usuarioState.id, datosActualizacion);

      const usuarioActualizado = await UsuarioCrud.obtenerUsuarioPorId(usuarioState.id);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

      setMensaje("Perfil actualizado correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMensaje("Error al actualizar. Intente nuevamente.");
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Está seguro que desea eliminar su perfil? Esta acción no se puede deshacer.")) return;
    
    try {
      await UsuarioCrud.eliminarUsuario(usuarioState.id);
      localStorage.removeItem('usuario');
      navigate('/Inicio');
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMensaje("Error al eliminar perfil. Intente nuevamente.");
    }
  };

  return (
    <div className="perfil-container">
      <div className="perfil-box">
        <button className="perfil-volver" onClick={() => navigate('/Inicio')}>
          <FaArrowLeft /> Volver al inicio
        </button>

        <h2>Mi Perfil</h2>
        {mensaje && <div className="mensaje">{mensaje}</div>}

        <form className="perfil-form" onSubmit={handleActualizar}>
          {[
            { label: "Nombres", name: "nombres", icon: <FaUser />, type: "text", placeholder: "Ingrese su nombre completo" },
            { label: "Apellidos", name: "apellidos", icon: <FaUser />, type: "text", placeholder: "Ingrese sus apellidos" },
            { label: "Fecha de nacimiento", name: "fechaNacimiento", icon: <FaCalendarAlt />, type: "date" },
            { label: "Número de cédula", name: "cedula", icon: <FaIdCard />, type: "text", placeholder: "Ingrese su número de cédula" },
            { label: "Correo electrónico", name: "correo", icon: <FaEnvelope />, type: "email", placeholder: "Ingrese su correo electrónico" },
            { label: "Número de teléfono", name: "telefono", icon: <FaPhoneAlt />, type: "tel", placeholder: "Ingrese su número" },
            { label: "Nueva contraseña (dejar en blanco para no cambiar)", name: "contrasena", icon: <FaLock />, type: "password", placeholder: "Ingrese su nueva contraseña" },
            { label: "Confirmar nueva contraseña", name: "confirmarContrasena", icon: <FaLock />, type: "password", placeholder: "Confirme su nueva contraseña" }
          ].map(({ label, name, icon, type, placeholder }) => (
            <div key={name}>
              <label>{label}</label>
              <div className="campo">
                {icon}
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={usuarioState[name]}
                  onChange={handleChange}
                />
              </div>
              {errores[name] && <span className="error-message">{errores[name]}</span>}
            </div>
          ))}

          <div className="botones-perfil">
            <button type="submit" className="btn-actualizar">
              <FaSave /> Actualizar Perfil
            </button>
            <button type="button" className="btn-eliminar" onClick={handleEliminar}>
              <FaTrash /> Eliminar Perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerfilUsuario;
