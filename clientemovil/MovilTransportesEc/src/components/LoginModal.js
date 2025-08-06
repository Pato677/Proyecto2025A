import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ visible, onClose, onOpenRegister }) => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    correo: '',
    contrasena: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!credentials.correo || !credentials.contrasena) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Attempting login with:', credentials.correo); // Debug log
      const response = await AuthService.login(credentials.correo, credentials.contrasena);
      console.log('Login response:', response); // Debug log
      
      if (response.success) {
        // Solo permitir usuarios finales en la app móvil
        if (response.usuario?.rol !== 'final') {
          Alert.alert('Error', 'Esta aplicación es solo para usuarios finales. Use la aplicación web para otros tipos de usuario.');
          setLoading(false);
          return;
        }

        // Guardar en el contexto de autenticación
        const loginSuccess = await login(response.usuario, response.token);
        
        if (loginSuccess) {
          Alert.alert('Éxito', response.message || 'Inicio de sesión exitoso', [
            {
              text: 'OK',
              onPress: () => {
                handleClose();
              }
            }
          ]);
          
          // Limpiar formulario
          setCredentials({
            correo: '',
            contrasena: '',
          });
        } else {
          Alert.alert('Error', 'Error al guardar los datos de sesión');
        }
      } else {
        Alert.alert('Error', response.message || 'Credenciales incorrectas');
      }
      
    } catch (error) {
      console.error('Login error:', error); // Debug log
      Alert.alert('Error', error.message || 'Error al iniciar sesión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCredentials({
      correo: '',
      contrasena: '',
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          {/* Icon */}
          <Icon name="login" size={40} color="#4A90E2" style={styles.icon} />

          {/* Title */}
          <Text style={styles.title}>Iniciar Sesión</Text>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Field */}
            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color="#fff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="coloc@mail.com"
                placeholderTextColor="rgba(255, 255, 255, 0.8)"
                value={credentials.correo}
                onChangeText={(value) => handleChange('correo', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Field */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#fff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="rgba(255, 255, 255, 0.8)"
                value={credentials.contrasena}
                onChangeText={(value) => handleChange('contrasena', value)}
                secureTextEntry={true}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#4A90E2" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>INGRESAR</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Register Link */}
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>
              ¡Si no dispone de una cuenta,{' '}
            </Text>
            <TouchableOpacity onPress={onOpenRegister}>
              <Text style={styles.registerLink}>click aquí</Text>
            </TouchableOpacity>
            <Text style={styles.registerText}>!</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#A8D0F0',
    borderRadius: 24,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  icon: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
  },
  form: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#fff',
    fontSize: 14,
  },
  registerLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginModal;
