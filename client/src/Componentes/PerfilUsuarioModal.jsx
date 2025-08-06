import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import UsuarioCrud from "./ComponentesCRUD/UsuarioCrud";
import PerfilCooperativaModal from "./PerfilCooperativaModal";
import './Estilos/PerfilUsuario.css';
import { 
  FaUser, FaCalendarAlt, FaIdCard, 
  FaEnvelope, FaPhoneAlt, FaLock, 
  FaSave, FaTrash, FaArrowLeft 
} from "react-icons/fa";

const PerfilUsuarioModal = ({ cerrar }) => {
  const { logout, usuario } = useAuth();
  
  // Debug: Log para verificar datos del usuario
  console.log('🔍 PerfilUsuarioModal - Usuario del contexto:', usuario);
  console.log('🔍 PerfilUsuarioModal - Usuario del localStorage:', localStorage.getItem('usuario'));
  
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
        // Primero intentar obtener del contexto, luego del localStorage
        let usuarioActual = usuario;
        if (!usuarioActual) {
          const usuarioStorage = localStorage.getItem('usuario');
          if (usuarioStorage) {
            try {
              usuarioActual = JSON.parse(usuarioStorage);
            } catch (error) {
              console.error('Error al parsear usuario del localStorage:', error);
              cerrar();
              return;
            }
          }
        }

        if (!usuarioActual || !usuarioActual.id) {
          console.error("No se pudo obtener datos del usuario");
          cerrar();
          return;
        }

        // Verificar si es superuser y bloquear acceso
        if (usuarioActual.rol === 'superuser') {
          alert('⚠️ El perfil del Superadministrador está protegido y no puede ser modificado por seguridad.');
          cerrar();
          return;
        }

        // Obtener datos frescos del servidor
        console.log('🔍 Consultando servidor con ID:', usuarioActual.id);
        const response = await UsuarioCrud.obtenerUsuarioPorId(usuarioActual.id);
        console.log('🔍 Respuesta del servidor:', response);
        
        if (response.success && response.data) {
          const usuarioCompleto = response.data;
          console.log('🔍 Usuario completo del servidor:', usuarioCompleto);
          
          // Obtener datos específicos según el rol
          let datosEspecificos = {};
          if (usuarioCompleto.rol === 'final' && usuarioCompleto.UsuarioFinal) {
            console.log('🔍 Procesando usuario final:', usuarioCompleto.UsuarioFinal);
            datosEspecificos = {
              nombres: usuarioCompleto.UsuarioFinal.nombres || "",
              apellidos: usuarioCompleto.UsuarioFinal.apellidos || "",
              fechaNacimiento: usuarioCompleto.UsuarioFinal.fecha_nacimiento || "",
              cedula: usuarioCompleto.UsuarioFinal.cedula || ""
            };
          } else if (usuarioCompleto.rol === 'cooperativa' && usuarioCompleto.UsuarioCooperativa) {
            console.log('🔍 Procesando cooperativa:', usuarioCompleto.UsuarioCooperativa);
            datosEspecificos = {
              nombres: usuarioCompleto.UsuarioCooperativa.razon_social || "",
              apellidos: "",
              fechaNacimiento: "",
              cedula: usuarioCompleto.UsuarioCooperativa.ruc || ""
            };
          } else {
            console.log('🔍 Rol no reconocido o datos faltantes. Rol:', usuarioCompleto.rol);
            console.log('🔍 UsuarioFinal:', usuarioCompleto.UsuarioFinal);
            console.log('🔍 UsuarioCooperativa:', usuarioCompleto.UsuarioCooperativa);
          }

          console.log('🔍 Datos específicos extraídos:', datosEspecificos);
          
          const nuevoEstado = {
            id: usuarioCompleto.id,
            ...datosEspecificos,
            correo: usuarioCompleto.correo || "",
            telefono: usuarioCompleto.telefono || "",
            contrasena: "",
            confirmarContrasena: ""
          };
          
          console.log('🔍 Nuevo estado que se va a aplicar:', nuevoEstado);
          setUsuarioState(nuevoEstado);
        } else {
          console.error("Error: No se pudo obtener los datos del usuario desde el servidor");
          console.error("Response completa:", response);
          
          // Fallback: usar datos del localStorage si el servidor falla
          console.log('🔍 Usando fallback con datos del localStorage');
          let datosEspecificosFallback = {};
          
          if (usuarioActual.rol === 'final') {
            // Intentar extraer datos del usuario final
            const usuarioFinal = usuarioActual.UsuarioFinal || usuarioActual;
            datosEspecificosFallback = {
              nombres: usuarioFinal.nombres || usuarioActual.nombres || "",
              apellidos: usuarioFinal.apellidos || usuarioActual.apellidos || "",
              fechaNacimiento: usuarioFinal.fecha_nacimiento || usuarioActual.fecha_nacimiento || "",
              cedula: usuarioFinal.cedula || usuarioActual.cedula || ""
            };
          } else if (usuarioActual.rol === 'cooperativa') {
            // Intentar extraer datos de la cooperativa
            const usuarioCooperativa = usuarioActual.UsuarioCooperativa || usuarioActual;
            datosEspecificosFallback = {
              nombres: usuarioCooperativa.razon_social || usuarioActual.razon_social || "",
              apellidos: "",
              fechaNacimiento: "",
              cedula: usuarioCooperativa.ruc || usuarioActual.ruc || ""
            };
          }
          
          const estadoFallback = {
            id: usuarioActual.id,
            ...datosEspecificosFallback,
            correo: usuarioActual.correo || "",
            telefono: usuarioActual.telefono || "",
            contrasena: "",
            confirmarContrasena: ""
          };
          
          console.log('🔍 Estado fallback aplicado:', estadoFallback);
          setUsuarioState(estadoFallback);
          setMensaje("Datos cargados desde caché local (conexión con servidor limitada)");
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        
        // Si hay error de red, intentar usar datos del localStorage como fallback
        console.log('🔍 Error capturado, usando fallback del localStorage');
        
        try {
          let usuarioActual = usuario;
          if (!usuarioActual) {
            const usuarioStorage = localStorage.getItem('usuario');
            if (usuarioStorage) {
              usuarioActual = JSON.parse(usuarioStorage);
            }
          }
          
          if (usuarioActual && usuarioActual.id) {
            let datosEspecificosFallback = {};
            
            if (usuarioActual.rol === 'final') {
              const usuarioFinal = usuarioActual.UsuarioFinal || usuarioActual;
              datosEspecificosFallback = {
                nombres: usuarioFinal.nombres || usuarioActual.nombres || "",
                apellidos: usuarioFinal.apellidos || usuarioActual.apellidos || "",
                fechaNacimiento: usuarioFinal.fecha_nacimiento || usuarioActual.fecha_nacimiento || "",
                cedula: usuarioFinal.cedula || usuarioActual.cedula || ""
              };
            } else if (usuarioActual.rol === 'cooperativa') {
              const usuarioCooperativa = usuarioActual.UsuarioCooperativa || usuarioActual;
              datosEspecificosFallback = {
                nombres: usuarioCooperativa.razon_social || usuarioActual.razon_social || "",
                apellidos: "",
                fechaNacimiento: "",
                cedula: usuarioCooperativa.ruc || usuarioActual.ruc || ""
              };
            }
            
            const estadoFallback = {
              id: usuarioActual.id,
              ...datosEspecificosFallback,
              correo: usuarioActual.correo || "",
              telefono: usuarioActual.telefono || "",
              contrasena: "",
              confirmarContrasena: ""
            };
            
            console.log('🔍 Estado fallback de error aplicado:', estadoFallback);
            setUsuarioState(estadoFallback);
            setMensaje("Datos cargados desde caché local (error de conexión)");
          } else {
            setMensaje("Error al cargar los datos del perfil - no hay datos disponibles");
          }
        } catch (fallbackError) {
          console.error("Error en fallback:", fallbackError);
          setMensaje("Error al cargar los datos del perfil");
        }
      }
    };

    cargarUsuario();
  }, [usuario, cerrar]);

  // Si es cooperativa, mostrar el modal específico - verificar tanto contexto como localStorage
  const esCooperativa = usuario?.rol === 'cooperativa' || 
    (localStorage.getItem('usuario') && 
     JSON.parse(localStorage.getItem('usuario'))?.rol === 'cooperativa');
  
  if (esCooperativa) {
    return <PerfilCooperativaModal cerrar={cerrar} />;
  }

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
    // Correo removido de validación ya que está deshabilitado
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
    
    // Verificación adicional de seguridad para superuser
    if (usuario && usuario.rol === 'superuser') {
      alert('⚠️ El perfil del Superadministrador no puede ser modificado por seguridad.');
      return;
    }
    
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
    // Verificación adicional de seguridad para superuser
    if (usuario && usuario.rol === 'superuser') {
      alert('⚠️ El perfil del Superadministrador no puede ser eliminado por seguridad.');
      return;
    }
    
    if (!window.confirm("¿Está seguro que desea eliminar su perfil? Esta acción no se puede deshacer.")) return;
    
    try {
      const response = await UsuarioCrud.eliminarUsuario(usuarioState.id);
      
      if (response.success || response.data) {
        // Usar la función logout del contexto para cerrar sesión completamente
        logout();
        
        alert("Perfil eliminado correctamente. Sesión cerrada.");
        cerrar();
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
        <button className="perfil-volver" onClick={cerrar}>
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
            { label: "Correo electrónico", name: "correo", icon: <FaEnvelope />, type: "email", placeholder: "Ingrese su correo electrónico", disabled: true },
            { label: "Número de teléfono", name: "telefono", icon: <FaPhoneAlt />, type: "tel", placeholder: "Ingrese su número" },
            { label: "Nueva contraseña (dejar en blanco para no cambiar)", name: "contrasena", icon: <FaLock />, type: "password", placeholder: "Ingrese su nueva contraseña" },
            { label: "Confirmar nueva contraseña", name: "confirmarContrasena", icon: <FaLock />, type: "password", placeholder: "Confirme su nueva contraseña" }
          ].map(({ label, name, icon, type, placeholder, disabled = false }) => (
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
                  disabled={disabled}
                  style={disabled ? { backgroundColor: '#f5f5f5', color: '#666' } : {}}
                />
              </div>
              {name === 'correo' && (
                <small style={{color: '#666', fontSize: '0.85em', display: 'block', marginTop: '4px'}}>
                  El correo no se puede modificar por seguridad
                </small>
              )}
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

export default PerfilUsuarioModal;
