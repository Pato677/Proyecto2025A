import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { AuthService, LocationService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DebugPanel = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [results, setResults] = useState('');

  const addResult = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => `${prev}\n[${timestamp}] ${message}`);
  };

  const testCities = async () => {
    try {
      addResult('🧪 Testing cities endpoint...');
      const cities = await LocationService.getCities();
      addResult(`✅ Cities loaded: ${cities.length} cities`);
      addResult(`First city: ${JSON.stringify(cities[0], null, 2)}`);
    } catch (error) {
      addResult(`❌ Cities error: ${error.message}`);
    }
  };

  const testLogin = async () => {
    try {
      addResult('🧪 Testing login endpoint...');
      const response = await AuthService.login('juan.perez@email.com', 'usuario123');
      addResult(`✅ Login successful: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      addResult(`❌ Login error: ${error.message}`);
    }
  };

  const clearResults = () => {
    setResults('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Debug Panel</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Auth Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}
        </Text>
        {user && (
          <Text style={styles.statusText}>
            User: {user.nombres} {user.apellidos} ({user.correo})
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={testCities}>
          <Text style={styles.buttonText}>Test Cities</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testLogin}>
          <Text style={styles.buttonText}>Test Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearResults}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsText}>{results || 'No results yet...'}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  statusContainer: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 12,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  resultsContainer: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    maxHeight: 200,
  },
  resultsText: {
    color: '#00ff00',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

export default DebugPanel;
