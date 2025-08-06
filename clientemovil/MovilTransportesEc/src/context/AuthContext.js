import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del usuario al iniciar la app
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      console.log('📱 AuthContext: Loading stored auth data...');
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
        console.log('✅ AuthContext: Stored auth data loaded successfully', userData.correo);
      } else {
        console.log('ℹ️ AuthContext: No stored auth data found');
      }
    } catch (error) {
      console.error('❌ AuthContext: Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, userToken) => {
    try {
      console.log('🔐 AuthContext: Saving user data...', userData);
      
      // Guardar en el estado
      setUser(userData);
      setToken(userToken);
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', userToken);
      
      console.log('✅ AuthContext: User data saved successfully');
      return true;
    } catch (error) {
      console.error('❌ AuthContext: Error saving auth data:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Limpiar estado
      setUser(null);
      setToken(null);
      
      // Limpiar AsyncStorage
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
