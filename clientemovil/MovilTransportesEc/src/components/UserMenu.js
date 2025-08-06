import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const UserMenu = ({ user, onProfilePress, onLogout, visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleProfilePress = () => {
    onClose();
    onProfilePress();
  };

  const handleLogoutPress = () => {
    onClose();
    onLogout();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View 
          style={[
            styles.menuContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header del menú */}
          <View style={styles.menuHeader}>
            <View style={styles.userInfo}>
              <Icon name="account-circle" size={40} color="#2196F3" />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {user?.datosUsuarioFinal?.nombres && user?.datosUsuarioFinal?.apellidos
                    ? `${user.datosUsuarioFinal.nombres} ${user.datosUsuarioFinal.apellidos}`
                    : user?.nombres || 'Usuario'}
                </Text>
                <Text style={styles.userEmail}>{user?.correo}</Text>
                <View style={styles.userRole}>
                  <Icon name="verified-user" size={14} color="#4CAF50" />
                  <Text style={styles.roleText}>
                    {user?.rol === 'final' ? 'Usuario Final' : 
                     user?.rol === 'cooperativa' ? 'Cooperativa' : 
                     user?.rol === 'superuser' ? 'Administrador' : 'Usuario'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Opciones del menú */}
          <View style={styles.menuOptions}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleProfilePress}
            >
              <Icon name="person" size={24} color="#2196F3" />
              <Text style={styles.menuItemText}>Mi Perfil</Text>
              <Icon name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleLogoutPress}
            >
              <Icon name="exit-to-app" size={24} color="#F44336" />
              <Text style={[styles.menuItemText, { color: '#F44336' }]}>
                Cerrar Sesión
              </Text>
              <Icon name="chevron-right" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80, // Ajustar según la altura del header
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: width * 0.75,
    maxWidth: width * 0.9,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  menuHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  userRole: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
  },
  menuOptions: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
});

export default UserMenu;
