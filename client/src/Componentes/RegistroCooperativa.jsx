import React, { useState } from "react";
import CooperativaCrud from "./ComponentesCRUD/CooperativaCrud.jsx";
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
  const [cooperativaState, setCooperativaState] = useState({
    razonSocial: "",
    permisoOperacion: "",
    ruc: "",
    correo: "",
    telefono: "",
    contrasena: "",
    confirmarContrasena: ""
  });

  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCooperativaState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando se edita
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
    if (!cooperativaState.contrasena) nuevosErrores.contrasena = "Contraseña es requerida";
    else if (cooperativaState.contrasena.length < 6) nuevosErrores.contrasena = "Contraseña debe tener al menos 6 caracteres";
    if (cooperativaState.contrasena !== cooperativaState.confirmarContrasena) nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setCargando(true);
    
    try {
      // Verificar si el correo ya existe
      const correoExiste = await CooperativaCrud.verificarCorreoExistente(cooperativaState.correo);
      if (correoExiste) {
        setErrores(prev => ({ ...prev, correo: "Este correo ya está registrado" }));
        setCargando(false);
        return;
      }
      
      // Crear los datos de la cooperativa en el formato correcto que espera el backend
      const cooperativaData = {
        correo: cooperativaState.correo,
        contrasena: cooperativaState.contrasena,
        telefono: cooperativaState.telefono,
        razon_social: cooperativaState.razonSocial,
        permiso_operacion: cooperativaState.permisoOperacion,
        ruc: cooperativaState.ruc
      };
      
      const response = await CooperativaCrud.registrarCooperativa(cooperativaData);
      
      console.log("Cooperativa registrada exitosamente:", response);
      alert("Registro de cooperativa exitoso");
      cerrar();
    } catch (error) {
      console.error("Error al registrar cooperativa:", error);
      
      // Manejo más específico de errores
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error al registrar cooperativa: ${error.response.data.message}`);
      } else {
        alert("Error al registrar cooperativa. Intente nuevamente.");
      }
    } finally {
      setCargando(false);
    }
  };
  return (
    <div className="registro-overlay" onClick={cerrar}>
      <div className="registro-box" onClick={(e) => e.stopPropagation()}>
        <button className="registro-close" onClick={cerrar}>×</button>
        <h2>
          <FaBuilding /> Registra tu Compañía
        </h2>

        <form className="registro-form" onSubmit={handleSubmit}>
          <div>
            <label>Razón social</label>
            <div className="campo">
              <FaUser />
              <input 
                type="text" 
                name="razonSocial"
                value={cooperativaState.razonSocial}
                onChange={handleChange}
                placeholder="Ingrese la razón social de la empresa"
                className={errores.razonSocial ? 'error' : ''}
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
                value={cooperativaState.permisoOperacion}
                onChange={handleChange}
                placeholder="Ingrese el número de permiso de operación"
                className={errores.permisoOperacion ? 'error' : ''}
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
                value={cooperativaState.ruc}
                onChange={handleChange}
                placeholder="Ingrese el RUC"
                className={errores.ruc ? 'error' : ''}
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
                value={cooperativaState.correo}
                onChange={handleChange}
                placeholder="Ingrese su correo electrónico"
                className={errores.correo ? 'error' : ''}
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
                value={cooperativaState.telefono}
                onChange={handleChange}
                placeholder="Ingrese su número"
                className={errores.telefono ? 'error' : ''}
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
                value={cooperativaState.contrasena}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                className={errores.contrasena ? 'error' : ''}
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
                value={cooperativaState.confirmarContrasena}
                onChange={handleChange}
                placeholder="Confirme su contraseña"
                className={errores.confirmarContrasena ? 'error' : ''}
              />
            </div>
            {errores.confirmarContrasena && <span className="error-message">{errores.confirmarContrasena}</span>}
          </div>
        </form>

        <button 
          type="submit" 
          className="btn-registrarse"
          disabled={cargando}
          onClick={handleSubmit}
        >
          {cargando ? "REGISTRANDO..." : "REGISTRARSE"}
        </button>

        <p className="registro-link">
          ¡Si desea registrarse de forma individual,{" "}
          <span onClick={cerrar}>click aquí</span>!
        </p>
      </div>
    </div>
  );
};

export default RegistroCooperativa;
