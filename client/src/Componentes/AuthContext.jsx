import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función de logout memoizada para evitar re-renderizados
  const logout = useCallback(() => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('dashboard');
  }, []);

  useEffect(() => {
    // Verificar si hay un usuario logueado al cargar la app
    const usuarioGuardado = localStorage.getItem('usuario');
    const tokenGuardado = localStorage.getItem('token');
    
    if (usuarioGuardado && tokenGuardado) {
      try {
        const usuarioParseado = JSON.parse(usuarioGuardado);
        setUsuario(usuarioParseado);
        setToken(tokenGuardado);
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  const login = useCallback((userData, authToken) => {
    try {
      setUsuario(userData);
      setToken(authToken);
      localStorage.setItem('usuario', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
    } catch (error) {
      console.error('Error en login:', error);
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    return usuario !== null && token !== null;
  }, [usuario, token]);

  const getUserRole = useCallback(() => {
    return usuario?.rol || null;
  }, [usuario]);

  const getDashboard = useCallback(() => {
    return localStorage.getItem('dashboard') || null;
  }, []);

  const value = {
    usuario,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    getDashboard
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
