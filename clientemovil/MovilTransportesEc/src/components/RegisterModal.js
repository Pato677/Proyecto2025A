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
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthService } from '../services/api';

const RegisterModal = ({ visible, onClose, onOpenLogin }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    cedula: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpiar errores cuando se edita el campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombres.trim()) newErrors.nombres = 'Nombres son requeridos';
    if (!formData.apellidos.trim()) newErrors.apellidos = 'Apellidos son requeridos';
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Fecha de nacimiento es requerida';
    if (!formData.cedula.trim()) newErrors.cedula = 'Cédula es requerida';
    if (!formData.correo.trim()) newErrors.correo = 'Correo es requerido';
    else if (!/^\S+@\S+\.\S+$/.test(formData.correo)) newErrors.correo = 'Correo no válido';
    if (!formData.telefono.trim()) newErrors.telefono = 'Teléfono es requerido';
    if (!formData.contrasena) newErrors.contrasena = 'Contraseña es requerida';
    else if (formData.contrasena.length < 6) newErrors.contrasena = 'Contraseña debe tener al menos 6 caracteres';
    if (formData.contrasena !== formData.confirmarContrasena) newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Registrar usuario directamente
      const response = await AuthService.register(formData);
      
      if (response.success) {
        Alert.alert('Éxito', 'Registro exitoso. Ahora puedes iniciar sesión.', [
          {
            text: 'OK',
            onPress: () => {
              handleClose();
              onOpenLogin();
            }
          }
        ]);
      } else {
        Alert.alert('Error', response.message || 'Error al registrar usuario');
      }
      
    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert('Error', error.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      cedula: '',
      correo: '',
      telefono: '',
      contrasena: '',
      confirmarContrasena: '',
    });
    setErrors({});
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

          {/* Title */}
          <Text style={styles.title}>Formulario de Registro</Text>

          {/* Form */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.form}>
              {/* Nombres */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Nombres</Text>
                <View style={styles.inputContainer}>
                  <Icon name="person" size={20} color="#fff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ingrese su nombre completo"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    value={formData.nombres}
                    onChangeText={(value) => handleChange('nombres', value)}
                  />
                </View>
                {errors.nombres && <Text style={styles.errorText}>{errors.nombres}</Text>}
              </View>

              {/* Apellidos */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Apellidos</Text>
                <View style={styles.inputContainer}>
                  <Icon name="person" size={20} color="#fff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ingrese sus apellidos"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    value={formData.apellidos}
                    onChangeText={(value) => handleChange('apellidos', value)}
                  />
                </View>
                {errors.apellidos && <Text style={styles.errorText}>{errors.apellidos}</Text>}
              </View>

              {/* Fecha de nacimiento */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Fecha de nacimiento</Text>
                <View style={styles.inputContainer}>
                  <Icon name="event" size={20} color="#fff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="dd/mm/aaaa"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    value={formData.fechaNacimiento}
                    onChangeText={(value) => handleChange('fechaNacimiento', value)}
                  />
                </View>
                {errors.fechaNacimiento && <Text style={styles.errorText}>{errors.fechaNacimiento}</Text>}
              </View>

              {/* Número de cédula */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Número de cédula</Text>
                <View style={styles.inputContainer}>
                  <Icon name="credit-card" size={20} color="#fff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ingrese su número de cédula"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    value={formData.cedula}
                    onChangeText={(value) => handleChange('cedula', value)}
                    keyboardType="numeric"
                  />
                </View>
                {errors.cedula && <Text style={styles.errorText}>{errors.cedula}</Text>}
              </View>

              {/* Correo electrónico */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Correo electrónico</Text>
                <View style={styles.inputContainer}>
                  <Icon name="email" size={20} color="#fff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ingrese su correo electrónico"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    value={formData.correo}
                    onChangeText={(value) => handleChange('correo', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
              </View>

              {/* Número de teléfono */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Número de teléfono</Text>
                <View style={styles.inputContainer}>
                  <Icon name="phone" size={20} color="#fff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ingrese su número"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    value={formData.telefono}
                    onChangeText={(value) => handleChange('telefono', value)}
                    keyboardType="phone-pad"
                  />
                </View>
                {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
              </View>

              {/* Contraseña */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.inputContainer}>
                  <Icon name="lock" size={20} color="#fff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ingrese su contraseña"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    value={formData.contrasena}
                    onChangeText={(value) => handleChange('contrasena', value)}
                    secureTextEntry={true}
                  />
                </View>
                {errors.contrasena && <Text style={styles.errorText}>{errors.contrasena}</Text>}
              </View>

              {/* Confirmar contraseña */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Confirmar contraseña</Text>
                <View style={styles.inputContainer}>
                  <Icon name="lock" size={20} color="#fff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirme su contraseña"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    value={formData.confirmarContrasena}
                    onChangeText={(value) => handleChange('confirmarContrasena', value)}
                    secureTextEntry={true}
                  />
                </View>
                {errors.confirmarContrasena && <Text style={styles.errorText}>{errors.confirmarContrasena}</Text>}
              </View>

              {/* Register Button */}
              <TouchableOpacity 
                style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#4A90E2" size="small" />
                ) : (
                  <Text style={styles.registerButtonText}>REGISTRARSE</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Login Link */}
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>
              ¡Si desea aplicar como cooperativa,{' '}
            </Text>
            <TouchableOpacity onPress={onOpenLogin}>
              <Text style={styles.loginLink}>click aquí</Text>
            </TouchableOpacity>
            <Text style={styles.loginText}>!</Text>
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
    paddingVertical: 40,
  },
  modalContainer: {
    backgroundColor: '#A8D0F0',
    borderRadius: 24,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
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
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 15,
  },
  scrollView: {
    maxHeight: 400,
  },
  form: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 3,
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 12,
  },
  loginLink: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default RegisterModal;
