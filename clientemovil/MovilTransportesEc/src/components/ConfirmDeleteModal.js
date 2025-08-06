import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ConfirmDeleteModal = ({ visible, onClose, onConfirm, userName }) => {
  const handleConfirm = () => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás absolutamente seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: onClose,
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            onClose();
            onConfirm();
          },
        },
      ]
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header con icono de advertencia */}
          <View style={styles.header}>
            <View style={styles.warningIconContainer}>
              <Icon name="warning" size={48} color="#FF9800" />
            </View>
            <Text style={styles.title}>Eliminar Cuenta</Text>
          </View>

          {/* Contenido */}
          <View style={styles.content}>
            <Text style={styles.message}>
              ¿Estás seguro de que deseas eliminar tu cuenta permanentemente?
            </Text>
            
            <Text style={styles.userName}>
              Usuario: {userName}
            </Text>

            <View style={styles.warningBox}>
              <Icon name="info" size={20} color="#F44336" />
              <Text style={styles.warningText}>
                Esta acción es irreversible. Se eliminarán todos tus datos y no podrás recuperar tu cuenta.
              </Text>
            </View>
          </View>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleConfirm}
            >
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
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
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  warningIconContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 50,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  userName: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  warningBox: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#D32F2F',
    marginLeft: 8,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderBottomRightRadius: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: 'bold',
  },
});

export default ConfirmDeleteModal;
