import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import UsuarioCrud from "./ComponentesCRUD/UsuarioCrud";
import './Estilos/PerfilUsuario.css';
import { 
  FaUser, FaCalendarAlt, FaIdCard, 
  FaEnvelope, FaPhoneAlt, FaLock, 
  FaSave, FaTrash, FaArrowLeft 
} from "react-icons/fa";

const PerfilUsuario = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Obtener la función logout del contexto
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

        const response = await UsuarioCrud.obtenerUsuarioPorId(usuarioStorage.id);
        if (response.success && response.data) {
          const usuario = response.data;
          
          // Obtener datos específicos según el rol
          let datosEspecificos = {};
          if (usuario.rol === 'final' && usuario.UsuarioFinal) {
            datosEspecificos = {
              nombres: usuario.UsuarioFinal.nombres || "",
              apellidos: usuario.UsuarioFinal.apellidos || "",
              fechaNacimiento: usuario.UsuarioFinal.fecha_nacimiento || "",
              cedula: usuario.UsuarioFinal.cedula || ""
            };
          } else if (usuario.rol === 'cooperativa' && usuario.UsuarioCooperativa) {
            datosEspecificos = {
              nombres: usuario.UsuarioCooperativa.razon_social || "",
              apellidos: "",
              fechaNacimiento: "",
              cedula: usuario.UsuarioCooperativa.ruc || ""
            };
          }

          setUsuarioState({
            id: usuario.id,
            ...datosEspecificos,
            correo: usuario.correo || "",
            telefono: usuario.telefono || "",
            contrasena: "",
            confirmarContrasena: ""
          });
        } else {
          console.error("Error: No se pudo obtener los datos del usuario");
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
      // Obtener el usuario actual del localStorage para conocer su rol
      const usuarioStorage = JSON.parse(localStorage.getItem('usuario'));
      
      const datosActualizacion = {
        telefono: usuarioState.telefono
      };

      // Incluir contraseña solo si se proporcionó
      if (usuarioState.contrasena) {
        datosActualizacion.contrasena = usuarioState.contrasena;
      }

      // Estructurar datos específicos según el rol del usuario
      if (usuarioStorage.rol === 'final' || usuarioStorage.rol === 'superuser') {
        datosActualizacion.datosUsuarioFinal = {
          nombres: usuarioState.nombres,
          apellidos: usuarioState.apellidos,
          fecha_nacimiento: usuarioState.fechaNacimiento,
          cedula: usuarioState.cedula
        };
      } else if (usuarioStorage.rol === 'cooperativa') {
        datosActualizacion.datosCooperativa = {
          razon_social: usuarioState.nombres,
          ruc: usuarioState.cedula
        };
      }

      const response = await UsuarioCrud.actualizarUsuario(usuarioState.id, datosActualizacion);

      if (response.success) {
        // Actualizar localStorage con los nuevos datos
        const usuarioActualizado = response.data;
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

        setMensaje("Perfil actualizado correctamente");
        setTimeout(() => setMensaje(""), 3000);
      } else {
        setMensaje("Error al actualizar. " + (response.message || "Intente nuevamente."));
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMensaje("Error al actualizar. Intente nuevamente.");
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Está seguro que desea eliminar su perfil? Esta acción no se puede deshacer.")) return;
    
    try {
      const response = await UsuarioCrud.eliminarUsuario(usuarioState.id);
      
      if (response.success || response.data) {
        // Usar la función logout del contexto para cerrar sesión completamente
        logout();
        
        alert("Perfil eliminado correctamente. Sesión cerrada.");
        navigate('/Inicio');
      } else {
        setMensaje("Error al eliminar perfil. " + (response.message || "Intente nuevamente."));
      }
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
