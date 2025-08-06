import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import { useAuth } from '../context/AuthContext';
import { LocationService } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [passengers, setPassengers] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [cities, setCities] = useState([]);
  const [terminals, setTerminals] = useState([]);

  // Cargar datos iniciales desde la base de datos
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Cargar ciudades
      const citiesResponse = await LocationService.getCities();
      if (citiesResponse.success) {
        setCities(citiesResponse.data);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleSearch = () => {
    // Validar campos antes de buscar
    if (!origin || !destination) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    // Navegar a la pantalla de resultados
    navigation.navigate('TripSelection', {
      origin,
      destination,
      date,
      passengers
    });
  };

  const increasePassengers = () => {
    if (passengers < 10) setPassengers(passengers + 1);
  };

  const decreasePassengers = () => {
    if (passengers > 1) setPassengers(passengers - 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="directions-bus" size={32} color="#fff" />
          <Text style={styles.headerTitle}>TransportesEC</Text>
        </View>
        <View style={styles.headerRight}>
          {isAuthenticated ? (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleLogout}
            >
              <Icon name="person" size={24} color="#fff" />
              <Text style={styles.headerButtonText}>
                Hola, {user?.datosUsuarioFinal?.nombres || user?.nombres || 'Usuario'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowLogin(true)}
            >
              <Icon name="person" size={24} color="#fff" />
              <Text style={styles.headerButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Search Form */}
        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}>
            Selecciona el origen, fecha de ida y número de pasajeros
          </Text>
          
          <View style={styles.searchForm}>
            {/* Origen */}
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Icon name="location-on" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Escribe ciudad o terminal"
                  value={origin}
                  onChangeText={setOrigin}
                />
              </View>
            </View>

            {/* Destino */}
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Icon name="location-on" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Escribe ciudad o terminal"
                  value={destination}
                  onChangeText={setDestination}
                />
              </View>
            </View>

            {/* Fecha y Pasajeros */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputContainer, styles.dateInput]}>
                <Icon name="event" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="dd/mm/aaaa"
                  value={date}
                  onChangeText={setDate}
                />
              </View>

              <View style={[styles.inputContainer, styles.passengersInput]}>
                <Icon name="group" size={20} color="#666" style={styles.inputIcon} />
                <TouchableOpacity onPress={decreasePassengers}>
                  <Icon name="remove" size={20} color="#666" />
                </TouchableOpacity>
                <Text style={styles.passengersText}>{passengers}</Text>
                <TouchableOpacity onPress={increasePassengers}>
                  <Icon name="add" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón Buscar */}
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>BUSCAR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Promotional Section */}
        <View style={styles.promoSection}>
          <View style={styles.promoCard}>
            <Image
              source={{ uri: 'https://via.placeholder.com/300x150/FF6B6B/FFFFFF?text=Bus+Image' }}
              style={styles.promoImage}
            />
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>
                ¡Cada viaje es una experiencia única hacia tu próximo destino!
              </Text>
              <Text style={styles.promoSubtitle}>
                Quito, Guayaquil, Manta, Loja, Cuenca, Cayambe y muchos lugares más por conocer
              </Text>
              <Text style={styles.promoPrice}>Por trayectos desde</Text>
              <Text style={styles.priceAmount}>USD 8.00</Text>
              <TouchableOpacity style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Compra ya</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Track Ticket Section */}
        <View style={styles.trackSection}>
          <TouchableOpacity style={styles.trackButton}>
            <Text style={styles.trackText}>¿Ya compraste tu boleto?</Text>
            <Text style={styles.trackLink}>Rastrear boleto</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Todos los derechos reservados.</Text>
        <Text style={styles.footerContact}>
          Av. Eloy Alfaro y República, Quito, Ecuador | contacto@transportesec.com | Tel: +593 2 600 1234
        </Text>
      </View>

      {/* Modals */}
      <LoginModal
        visible={showLogin}
        onClose={() => setShowLogin(false)}
        onOpenRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <RegisterModal
        visible={showRegister}
        onClose={() => setShowRegister(false)}
        onOpenLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  headerButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  searchCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchForm: {
    gap: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  dateInput: {
    flex: 1,
  },
  passengersInput: {
    flex: 0.7,
    justifyContent: 'space-between',
  },
  passengersText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 15,
  },
  searchButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  promoSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  promoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  promoImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  promoContent: {
    padding: 20,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  promoPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  promoButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
  },
  promoButtonText: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  trackSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  trackButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
  },
  trackText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  trackLink: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 5,
  },
  footerContact: {
    color: '#ccc',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;
