import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import './Estilos/AutocompleteTerminal.css'; 

const AutocompleteTerminal = forwardRef(({ value, onChange, nextInputRef }, ref) => {
  const [input, setInput] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [allTerminales, setAllTerminales] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const isUserInput = useRef(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Función para cargar terminales desde el backend
  const cargarTerminales = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:8000/ciudades-terminales');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Estructura: [{ ciudad: 'Quito', terminales: [{ id: 1, nombre: 'Quitumbe' }, ...] }, ...]
        const terminalData = data.data.map(ciudad => ({
          ciudad: ciudad.nombre,
          terminales: ciudad.terminales.map(terminal => ({
            id: terminal.id,
            nombre: terminal.nombre
          }))
        }));
          setAllTerminales(terminalData);
      } else {
        console.warn('⚠️ Respuesta no válida del servidor:', data);
        setAllTerminales([]);
      }
    } catch (error) {
      console.error('❌ Error al cargar terminales:', error);
      setAllTerminales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Exponer métodos del input interno al componente padre
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    select: () => inputRef.current?.select(),
    recargarTerminales: cargarTerminales // Función para recargar desde el padre
  }));

  // Cargar terminales al montar el componente
  useEffect(() => {
    cargarTerminales();
  }, [cargarTerminales]);

  // Crear versión memoizada de onChange
  const memoizedOnChange = useCallback((ciudad, terminalNombre, terminalId) => {
    console.log("onChange enviado al padre:", { ciudad, terminalNombre, terminalId });
    if (onChange) {
      onChange(ciudad, terminalNombre, terminalId);
    }
  }, [onChange]);

  useEffect(() => {
    // Solo actualiza el input si el cambio viene del padre
    if (!isUserInput.current) {
      setInput(value || '');
    }
    isUserInput.current = false;
  }, [value]);

  useEffect(() => {
    if (input.length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      // Solo notifica al padre si el usuario borró el campo manualmente
      if (memoizedOnChange && isUserInput.current) {
        memoizedOnChange('', '');
      }
      return;
    }
    
    // Verificar si el input actual es una selección válida completa
    const esSeleccionCompleta = allTerminales.some(ciudad => 
      ciudad.terminales.some(terminal => 
        input.trim() === `${ciudad.ciudad} (${terminal.nombre})`
      )
    );
    
    // Si es una selección completa válida, no mostrar sugerencias
    if (esSeleccionCompleta && !isUserInput.current) {
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }
    
    const lowerInput = input.toLowerCase();
    
    // Extraer términos de búsqueda del input
    let searchTerms = [lowerInput];
    const match = input.match(/^(.+?)\s*\((.+?)\)\s*$/);
    if (match) {
      const [, ciudad, terminal] = match;
      searchTerms = [
        ciudad.trim().toLowerCase(),
        terminal.trim().toLowerCase(),
        lowerInput
      ];
    }
    
    // Buscar terminales que coincidan con cualquiera de los términos
    const filtered = allTerminales.flatMap(t =>
      t.terminales
        .filter(terminal => {
          return searchTerms.some(term => 
            t.ciudad.toLowerCase().includes(term) ||
            terminal.nombre.toLowerCase().includes(term)
          );
        })
        .map(terminal => ({
          ciudad: t.ciudad,
          terminal,
          searchTerm: searchTerms[0]
        }))
    );
    
    setSuggestions(filtered);
    setIsOpen(true);
    setSelectedIndex(-1);
  }, [input, allTerminales, memoizedOnChange]);

  // Función para resaltar el texto coincidente
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="autocomplete-highlight">{part}</span> : 
        part
    );
  };

  const handleInputChange = e => {
    isUserInput.current = true;
    setInput(e.target.value);
  };

  const handleSelect = (ciudad, terminal) => {
    setInput(`${ciudad} (${terminal.nombre})`);
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    console.log("Seleccionado:", { ciudad, terminalNombre: terminal.nombre, terminalId: terminal.id });
    if (memoizedOnChange) {
      memoizedOnChange(ciudad, terminal.nombre, terminal.id);
    }
    
    // Pasar el focus al siguiente input si existe la referencia
    if (nextInputRef && nextInputRef.current) {
      setTimeout(() => {
        if (nextInputRef.current.focus) {
          nextInputRef.current.focus();
        } else {
          nextInputRef.current.focus();
        }
      }, 100);
    } else if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    
    if (suggestions.length === 0) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const selected = suggestions[selectedIndex];
          handleSelect(selected.ciudad, selected.terminal);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        if (inputRef.current) {
          inputRef.current.blur();
        }
        break;
        
      default:
        break;
    }
  };

  // Scroll automático del elemento seleccionado
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current && suggestions.length > 0) {
      const selectedElement = listRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex, suggestions.length]);

  const handleInputFocus = (e) => {
    e.target.select();
    
    const esSeleccionCompleta = allTerminales.some(ciudad => 
  ciudad.terminales.some(terminal => 
    input.trim() === `${ciudad.ciudad} (${terminal.nombre})`
  )
);
    
    if (input.length > 0 && !esSeleccionCompleta) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 150);
  };

  // Generar ID único para el listbox
  const listboxId = `autocomplete-listbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="autocomplete-terminal">
      <input
        ref={inputRef}
        type="text"
        placeholder={loading ? "Cargando terminales..." : "Escribe ciudad o terminal"}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="autocomplete-input"
        autoComplete="off"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        role="combobox"
        disabled={loading}
      />
      
      {/* Indicador de carga */}
      {loading && (
        <div className="autocomplete-loading">
          <div className="loading-spinner"></div>
          <span>Cargando terminales...</span>
        </div>
      )}

      {/* Lista de sugerencias cuando hay resultados */}
      {isOpen && suggestions.length > 0 && !loading && (
        <ul 
          ref={listRef}
          id={listboxId}
          className="autocomplete-listbox" 
          role="listbox"
        >
          {suggestions.map((s, idx) => (
            <li
              key={`${s.ciudad}-${s.terminal.nombre}-${s.terminal.id}-${idx}`}
              className={`autocomplete-item ${selectedIndex === idx ? 'selected' : ''}`}
              onClick={() => handleSelect(s.ciudad, s.terminal)}
              role="option"
              aria-selected={selectedIndex === idx}
            >
              <span className="ciudad-text">
                {highlightMatch(s.ciudad, s.searchTerm)}
              </span>
              <span className="separator"> (</span>
              <span className="terminal-text">
                {highlightMatch(s.terminal.nombre, s.searchTerm)}
              </span>
              <span className="separator">)</span>
            </li>
          ))}
        </ul>
      )}

      {/* Mensaje cuando no hay resultados */}
      {isOpen && input.length > 0 && suggestions.length === 0 && allTerminales.length > 0 && !loading && (
        <div className="autocomplete-no-results">
          <div className="no-results-icon">🚌</div>
          <div className="no-results-text">
            <strong>¡Ups! No encontramos esa terminal</strong>
          </div>
          <div className="no-results-suggestion">
            Intenta con otra ciudad o terminal
          </div>
        </div>
      )}

      {/* Mensaje de estado para accesibilidad */}
      <div 
        className="autocomplete-status" 
        aria-live="polite" 
        aria-atomic="true"
        style={{ 
          position: 'absolute', 
          left: '-10000px', 
          width: '1px', 
          height: '1px', 
          overflow: 'hidden' 
        }}
      >
        {loading && "Cargando terminales..."}
        {isOpen && suggestions.length > 0 && !loading && 
          `${suggestions.length} sugerencias disponibles. Use las flechas para navegar y Enter para seleccionar.`
        }
        {isOpen && input.length > 0 && suggestions.length === 0 && allTerminales.length > 0 && !loading &&
          `No se encontraron resultados para "${input}"`
        }
      </div>
    </div>
  );
});

AutocompleteTerminal.displayName = 'AutocompleteTerminal';

export default AutocompleteTerminal;