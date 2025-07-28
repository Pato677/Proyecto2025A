import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Estilos/Spinner.css';

const ProtectedRoute = memo(({ children, requiredRole = null, redirectTo = '/Inicio' }) => {
  const { isAuthenticated, getUserRole, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">
          Verificando autenticación...
        </div>
        <div className="spinner"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al inicio
  if (!isAuthenticated()) {
    console.log('Usuario no autenticado, redirigiendo a:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  const userRole = getUserRole();
  
  // Si se requiere un rol específico y no lo tiene, redirigir
  if (requiredRole && userRole !== requiredRole) {
    console.log(`Acceso denegado. Rol requerido: ${requiredRole}, Rol actual: ${userRole}`);
    return <Navigate to={redirectTo} replace />;
  }

  // Si todo está bien, mostrar el componente
  console.log(`Acceso autorizado. Rol: ${userRole}`);
  return children;
});

export default ProtectedRoute;
