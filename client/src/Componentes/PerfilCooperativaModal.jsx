import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import UsuarioCrud from "./ComponentesCRUD/UsuarioCrud";
import "./Estilos/Registro.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaIdCard,
  FaBuilding,
  FaSave,
  FaTrash
} from "react-icons/fa";

const PerfilCooperativaModal = ({ cerrar }) => {
  const { usuario, logout } = useAuth();
  const [cooperativaState, setCooperativaState] = useState({
    id: "",
    razonSocial: "",
    permisoOperacion: "",
    ruc: "",
    correo: "",
    telefono: "",
    contrasena: "",
    confirmarContrasena: "",
    estado: ""
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarDatosCooperativa = async () => {
      try {
        if (!usuario || !usuario.id) return;

        const response = await UsuarioCrud.obtenerUsuarioPorId(usuario.id);
        if (response.success && response.data) {
          const userData = response.data;
          
          setCooperativaState({
            id: userData.id,
            razonSocial: userData.UsuarioCooperativa?.razon_social || "",
            permisoOperacion: userData.UsuarioCooperativa?.permiso_operacion || "",
            ruc: userData.UsuarioCooperativa?.ruc || "",
            correo: userData.correo || "",
            telefono: userData.telefono || "",
            contrasena: "",
            confirmarContrasena: "",
            estado: userData.UsuarioCooperativa?.estado || ""
          });
        }
      } catch (error) {
        console.error("Error al cargar datos de cooperativa:", error);
      }
    };

    cargarDatosCooperativa();
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCooperativaState(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!cooperativaState.razonSocial.trim()) nuevosErrores.razonSocial = "Razón social es requerida";
    if (!cooperativaState.permisoOperacion.trim()) nuevosErrores.permisoOperacion = "Permiso de operación es requerido";
    if (!cooperativaState.ruc.trim()) nuevosErrores.ruc = "RUC es requerido";
    if (!cooperativaState.correo.trim()) nuevosErrores.correo = "Correo es requerido";
    else if (!/^\S+@\S+\.\S+$/.test(cooperativaState.correo)) nuevosErrores.correo = "Correo no válido";
    if (!cooperativaState.telefono.trim()) nuevosErrores.telefono = "Teléfono es requerido";

    if (cooperativaState.contrasena || cooperativaState.confirmarContrasena) {
      if (cooperativaState.contrasena.length < 6) nuevosErrores.contrasena = "Contraseña debe tener al menos 6 caracteres";
      if (cooperativaState.contrasena !== cooperativaState.confirmarContrasena) nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    try {
      const datosActualizacion = {
        telefono: cooperativaState.telefono,
        datosCooperativa: {
          razon_social: cooperativaState.razonSocial,
          permiso_operacion: cooperativaState.permisoOperacion,
          ruc: cooperativaState.ruc,
          estado: cooperativaState.estado
        }
      };

      if (cooperativaState.contrasena) {
        datosActualizacion.contrasena = cooperativaState.contrasena;
      }

      const response = await UsuarioCrud.actualizarUsuario(cooperativaState.id, datosActualizacion);

      if (response.success) {
        localStorage.setItem('usuario', JSON.stringify(response.data));
        setMensaje("Perfil actualizado correctamente");
        setTimeout(() => {
          setMensaje("");
          cerrar();
        }, 2000);
      } else {
        setMensaje("Error al actualizar. " + (response.message || "Intente nuevamente."));
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMensaje("Error al actualizar. Intente nuevamente.");
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Está seguro que desea eliminar su cooperativa? Esta acción no se puede deshacer.")) return;
    
    try {
      const response = await UsuarioCrud.eliminarUsuario(cooperativaState.id);
      
      if (response.success || response.data) {
        logout();
        alert("Cooperativa eliminada correctamente. Sesión cerrada.");
        cerrar();
      } else {
        setMensaje("Error al eliminar cooperativa. " + (response.message || "Intente nuevamente."));
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMensaje("Error al eliminar cooperativa. Intente nuevamente.");
    }
  };

  return (
    <div className="registro-overlay" onClick={cerrar}>
      <div className="registro-box" onClick={(e) => e.stopPropagation()}>
        <button className="registro-close" onClick={cerrar}>×</button>
        <h2>
          <FaBuilding /> Mi Perfil - Cooperativa
        </h2>

        {mensaje && <div className="mensaje-modal">{mensaje}</div>}

        <form className="registro-form" onSubmit={handleActualizar}>
          <div>
            <label>Razón social</label>
            <div className="campo">
              <FaUser />
              <input 
                type="text" 
                name="razonSocial"
                placeholder="Ingrese la razón social de la empresa"
                value={cooperativaState.razonSocial}
                onChange={handleChange}
              />
            </div>
            {errores.razonSocial && <span className="error-message">{errores.razonSocial}</span>}
          </div>

          <div>
            <label>Número de permiso de operación de la compañía</label>
            <div className="campo">
              <FaIdCard />
              <input 
                type="text" 
                name="permisoOperacion"
                placeholder="Ingrese el número de permiso de operación"
                value={cooperativaState.permisoOperacion}
                onChange={handleChange}
              />
            </div>
            {errores.permisoOperacion && <span className="error-message">{errores.permisoOperacion}</span>}
          </div>

          <div>
            <label>RUC de la cooperativa</label>
            <div className="campo">
              <FaIdCard />
              <input 
                type="text" 
                name="ruc"
                placeholder="Ingrese el RUC"
                value={cooperativaState.ruc}
                onChange={handleChange}
              />
            </div>
            {errores.ruc && <span className="error-message">{errores.ruc}</span>}
          </div>

          <div>
            <label>Correo electrónico</label>
            <div className="campo">
              <FaEnvelope />
              <input 
                type="email" 
                name="correo"
                placeholder="Ingrese su correo electrónico"
                value={cooperativaState.correo}
                onChange={handleChange}
                disabled
              />
            </div>
            <small style={{color: '#666', fontSize: '0.85em'}}>El correo no se puede modificar</small>
          </div>

          <div>
            <label>Número de teléfono</label>
            <div className="campo">
              <FaPhoneAlt />
              <input 
                type="tel" 
                name="telefono"
                placeholder="Ingrese su número de teléfono"
                value={cooperativaState.telefono}
                onChange={handleChange}
              />
            </div>
            {errores.telefono && <span className="error-message">{errores.telefono}</span>}
          </div>

          <div>
            <label>Nueva contraseña (dejar en blanco para no cambiar)</label>
            <div className="campo">
              <FaLock />
              <input 
                type="password" 
                name="contrasena"
                placeholder="Ingrese su nueva contraseña"
                value={cooperativaState.contrasena}
                onChange={handleChange}
              />
            </div>
            {errores.contrasena && <span className="error-message">{errores.contrasena}</span>}
          </div>

          <div>
            <label>Confirmar nueva contraseña</label>
            <div className="campo">
              <FaLock />
              <input 
                type="password" 
                name="confirmarContrasena"
                placeholder="Confirme su nueva contraseña"
                value={cooperativaState.confirmarContrasena}
                onChange={handleChange}
              />
            </div>
            {errores.confirmarContrasena && <span className="error-message">{errores.confirmarContrasena}</span>}
          </div>

          <div className="registro-buttons">
            <button type="submit" className="registro-submit">
              <FaSave /> Actualizar Perfil
            </button>
            <button type="button" className="registro-delete" onClick={handleEliminar}>
              <FaTrash /> Eliminar Cooperativa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerfilCooperativaModal;
