import React from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UsuarioCrud from "./ComponentesCRUD/UsuarioCrud";
import "./Estilos/Login.css";

const Login = ({ cerrar, abrirRegistro }) => {
  const [credenciales, setCredenciales] = React.useState({
    correo: "",
    contrasena: ""
  });
  
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredenciales(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al escribir
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Validaciones básicas
      if (!credenciales.correo || !credenciales.contrasena) {
        setError("Todos los campos son obligatorios");
        return;
      }
      
      // Verificar credenciales
      const usuario = await UsuarioCrud.verificarCredenciales(
        credenciales.correo, 
        credenciales.contrasena
      );
      
      if (usuario) {
        // Guardar usuario en localStorage o contexto
        localStorage.setItem("usuario", JSON.stringify(usuario));
        
        // Redirigir a /Inicio
        navigate("/Inicio");
        
        // Cerrar modal si es necesario
        if (cerrar) cerrar();
      } else {
        setError("Correo o contraseña incorrectos");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Ocurrió un error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={cerrar}>
      <div className="login-box" onClick={(e) => e.stopPropagation()}>
        <button className="login-close" onClick={cerrar}>×</button>
        <FaSignInAlt className="login-icon" />
        <h2>Iniciar Sesión</h2>
        
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <FaUser className="field-icon" />
            <input 
              type="email" 
              name="correo"
              placeholder="Ingrese su correo electrónico"
              value={credenciales.correo}
              onChange={handleChange}
            />
          </div>

          <div className="login-field">
            <FaLock className="field-icon" />
            <input 
              type="password" 
              name="contrasena"
              placeholder="Ingrese su contraseña"
              value={credenciales.contrasena}
              onChange={handleChange}
            />
          </div>

          <div className="login-buttons">
            <button 
              type="submit" 
              className="btn-ingresar"
              disabled={loading}
            >
              {loading ? "CARGANDO..." : "INGRESAR"}
            </button>
            <button type="button" className="btn-admin">Admin</button>
          </div>
        </form>

        <p className="login-register">
          ¡Si no dispone de una cuenta,{" "}
          <span onClick={abrirRegistro}>click aquí</span>!
        </p>
      </div>
    </div>
  );
};

export default Login;