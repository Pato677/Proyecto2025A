import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { UserService, AuthService } from '../services/api';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const UserProfile = ({ visible, onClose }) => {
  const { user, token, logout, updateUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Estados para los campos editables
  const [telefono, setTelefono] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  useEffect(() => {
    if (visible && user?.id) {
      loadUserData();
    }
  }, [visible, user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUserById(user.id, token);
      
      if (response.success) {
        setUserData(response.data);
        // Cargar datos en los campos
        setTelefono(response.data.telefono || '');
        
        if (response.data.UsuarioFinal) {
          setNombres(response.data.UsuarioFinal.nombres || '');
          setApellidos(response.data.UsuarioFinal.apellidos || '');
          setFechaNacimiento(response.data.UsuarioFinal.fecha_nacimiento || '');
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validaciones
      if (!telefono.trim()) {
        Alert.alert('Error', 'El teléfono es requerido');
        return;
      }

      if (user.rol === 'final' && (!nombres.trim() || !apellidos.trim())) {
        Alert.alert('Error', 'Nombres y apellidos son requeridos');
        return;
      }

      if (nuevaContrasena && nuevaContrasena !== confirmarContrasena) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }

      if (nuevaContrasena && nuevaContrasena.length < 6) {
        Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
        return;
      }

      setSaving(true);

      const updateData = {
        telefono: telefono.trim(),
      };

      // Agregar nueva contraseña si se especificó
      if (nuevaContrasena) {
        updateData.contrasena = nuevaContrasena;
      }

      // Agregar datos específicos según el rol
      if (user.rol === 'final') {
        updateData.datosUsuarioFinal = {
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          fecha_nacimiento: fechaNacimiento,
        };
      }

      const response = await UserService.updateUser(user.id, updateData, token);

      if (response.success) {
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
        setEditing(false);
        setNuevaContrasena('');
        setConfirmarContrasena('');
        
        // Actualizar el contexto de autenticación con los nuevos datos
        await updateUser(response.data);
        
        loadUserData(); // Recargar datos
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await UserService.deleteUser(user.id, token);
      
      if (response.success) {
        Alert.alert(
          'Cuenta Eliminada', 
          'Tu cuenta ha sido eliminada exitosamente',
          [
            {
              text: 'OK',
              onPress: async () => {
                await logout();
                onClose();
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <TouchableOpacity 
            onPress={() => setEditing(!editing)}
            style={styles.editButton}
          >
            <Icon name={editing ? "cancel" : "edit"} size={24} color="#2196F3" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Cargando datos...</Text>
          </View>
        ) : (
          <ScrollView style={styles.content}>
            {/* Información básica */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información de Cuenta</Text>
              
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Correo Electrónico</Text>
                <Text style={styles.fieldValue}>{userData?.correo}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Rol</Text>
                <Text style={styles.fieldValue}>
                  {userData?.rol === 'final' ? 'Usuario Final' : 
                   userData?.rol === 'cooperativa' ? 'Cooperativa' : 
                   userData?.rol === 'superuser' ? 'Administrador' : 'Usuario'}
                </Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Teléfono</Text>
                {editing ? (
                  <TextInput
                    style={styles.textInput}
                    value={telefono}
                    onChangeText={setTelefono}
                    placeholder="Ingresa tu teléfono"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.fieldValue}>{userData?.telefono || 'No especificado'}</Text>
                )}
              </View>
            </View>

            {/* Información personal (solo para usuarios finales) */}
            {userData?.rol === 'final' && userData?.UsuarioFinal && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información Personal</Text>
                
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Nombres</Text>
                  {editing ? (
                    <TextInput
                      style={styles.textInput}
                      value={nombres}
                      onChangeText={setNombres}
                      placeholder="Ingresa tus nombres"
                    />
                  ) : (
                    <Text style={styles.fieldValue}>{userData?.UsuarioFinal?.nombres}</Text>
                  )}
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Apellidos</Text>
                  {editing ? (
                    <TextInput
                      style={styles.textInput}
                      value={apellidos}
                      onChangeText={setApellidos}
                      placeholder="Ingresa tus apellidos"
                    />
                  ) : (
                    <Text style={styles.fieldValue}>{userData?.UsuarioFinal?.apellidos}</Text>
                  )}
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Cédula</Text>
                  <Text style={styles.fieldValue}>{userData?.UsuarioFinal?.cedula}</Text>
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Fecha de Nacimiento</Text>
                  <Text style={styles.fieldValue}>
                    {formatDate(userData?.UsuarioFinal?.fecha_nacimiento)}
                  </Text>
                </View>
              </View>
            )}

            {/* Cambiar contraseña */}
            {editing && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
                
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Nueva Contraseña</Text>
                  <TextInput
                    style={styles.textInput}
                    value={nuevaContrasena}
                    onChangeText={setNuevaContrasena}
                    placeholder="Dejar vacío para mantener actual"
                    secureTextEntry
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Confirmar Contraseña</Text>
                  <TextInput
                    style={styles.textInput}
                    value={confirmarContrasena}
                    onChangeText={setConfirmarContrasena}
                    placeholder="Confirma tu nueva contraseña"
                    secureTextEntry
                  />
                </View>
              </View>
            )}

            {/* Botones de acción */}
            <View style={styles.actionButtons}>
              {editing ? (
                <TouchableOpacity 
                  style={[styles.saveButton, saving && styles.buttonDisabled]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Icon name="save" size={20} color="#fff" />
                      <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => setShowDeleteModal(true)}
                >
                  <Icon name="delete" size={20} color="#fff" />
                  <Text style={styles.deleteButtonText}>Eliminar Cuenta</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        )}

        {/* Modal de confirmación de eliminación */}
        <ConfirmDeleteModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          userName={userData?.UsuarioFinal?.nombres || userData?.correo}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  actionButtons: {
    paddingVertical: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default UserProfile;
