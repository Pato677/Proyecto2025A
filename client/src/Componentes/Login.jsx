import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { useAuth } from "./AuthContext";
import UsuarioCrud from "./ComponentesCRUD/UsuarioCrud";
import "./Estilos/Login.css";

const Login = ({ cerrar, abrirRegistro, onLoginExitoso }) => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [credenciales, setCredenciales] = useState({
        correo: "",
        contrasena: ""
    });
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setCredenciales(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (error) setError("");
    }, [error]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            // Validaciones básicas
            if (!credenciales.correo || !credenciales.contrasena) {
                setError("Todos los campos son obligatorios");
                return;
            }

            // Hacer login con el backend
            const loginResponse = await UsuarioCrud.login(
                credenciales.correo, 
                credenciales.contrasena
            );
            
            if (loginResponse.success) {
                // Mostrar mensaje de bienvenida en consola
                console.log("✅", loginResponse.mensajeBienvenida);
                
                // Actualizar el contexto de autenticación
                authLogin(loginResponse.usuario, loginResponse.token);
                
                // Cerrar modal de login
                if (cerrar) cerrar();
                
                // Notificar al componente padre si existe
                if (onLoginExitoso) {
                    onLoginExitoso(loginResponse.usuario);
                }
                
                // Usar setTimeout para asegurar que las actualizaciones de estado se completen
                setTimeout(() => {
                    // Redirigir según el dashboard configurado
                    const dashboard = loginResponse.configuracion.dashboard;
                    
                    switch (dashboard) {
                        case 'usuario':
                            // Usuarios finales van a la selección de viajes
                            console.log("🚀 Redirigiendo a interfaz de usuario...");
                            navigate('/Inicio');
                            break;
                        case 'cooperativa':
                            // Cooperativas van al dashboard administrativo
                            console.log("🏢 Redirigiendo a dashboard de cooperativa...");
                            navigate('/dashboard');
                            break;
                        case 'admin':
                            // Administradores van al panel de admin
                            console.log("👨‍💼 Redirigiendo a panel de administrador...");
                            navigate('/dashboard');
                            break;
                        default:
                            // Fallback por si hay un rol no manejado
                            console.log("⚠️ Rol no reconocido, redirigiendo al inicio...");
                            navigate('/Inicio');
                            break;
                    }
                }, 100); // Delay de 100ms para asegurar que el estado se actualice
                
            } else {
                setError("Error en el inicio de sesión");
            }
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            setError(err.message || "Ocurrió un error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    }, [credenciales, authLogin, cerrar, onLoginExitoso, navigate, error]);

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
                            required
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
                            required
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