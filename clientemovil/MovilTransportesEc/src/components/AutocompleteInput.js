import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AutocompleteInput = ({ 
  placeholder, 
  value, 
  onChangeText, 
  cities = [], 
  icon = "location-on",
  onItemSelect 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (value.length > 0) {
      // Filtrar ciudades y terminales que coincidan con el texto
      const filtered = [];
      
      cities.forEach(city => {
        // Agregar ciudad si coincide
        if (city.nombre.toLowerCase().includes(value.toLowerCase())) {
          filtered.push({
            id: `city-${city.id}`,
            name: city.nombre,
            type: 'ciudad',
            cityId: city.id,
            displayText: city.nombre
          });
        }
        
        // Agregar terminales que coincidan
        if (city.terminales) {
          city.terminales.forEach(terminal => {
            if (terminal.nombre.toLowerCase().includes(value.toLowerCase()) ||
                city.nombre.toLowerCase().includes(value.toLowerCase())) {
              filtered.push({
                id: `terminal-${terminal.id}`,
                name: terminal.nombre,
                type: 'terminal',
                cityId: city.id,
                cityName: city.nombre,
                terminalId: terminal.id,
                displayText: `${terminal.nombre} (${city.nombre})`
              });
            }
          });
        }
      });
      
      setFilteredItems(filtered.slice(0, 8)); // Mostrar máximo 8 resultados
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredItems([]);
    }
  }, [value, cities]);

  const handleItemPress = (item) => {
    onChangeText(item.displayText);
    setShowSuggestions(false);
    
    // Notificar al componente padre sobre la selección
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  const handleInputFocus = () => {
    if (value.length > 0 && filteredItems.length > 0) {
      setShowSuggestions(true);
    }
  };

  const renderSuggestionItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.suggestionItem,
        index === filteredItems.length - 1 && styles.lastSuggestionItem
      ]}
      onPress={() => handleItemPress(item)}
    >
      <Icon 
        name={item.type === 'ciudad' ? 'location-city' : 'location-on'} 
        size={16} 
        color="#666" 
        style={styles.suggestionIcon}
      />
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionName}>{item.name}</Text>
        {item.type === 'terminal' && (
          <Text style={styles.suggestionCity}>{item.cityName}</Text>
        )}
      </View>
      <Icon name="keyboard-arrow-right" size={16} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon name={icon} size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleInputFocus}
          autoCorrect={false}
          autoCapitalize="words"
        />
        {showSuggestions && (
          <TouchableOpacity onPress={() => setShowSuggestions(false)}>
            <Icon name="clear" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filteredItems}
            renderItem={({ item, index }) => renderSuggestionItem({ item, index })}
            keyExtractor={(item) => item.id}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
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
  suggestionsContainer: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    maxHeight: 240,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  suggestionsList: {
    borderRadius: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastSuggestionItem: {
    borderBottomWidth: 0,
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  suggestionCity: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default AutocompleteInput;
