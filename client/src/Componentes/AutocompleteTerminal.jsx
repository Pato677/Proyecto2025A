import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './Estilos/AutocompleteTerminal.css'; 

const AutocompleteTerminal = forwardRef(({ value, onChange, nextInputRef }, ref) => {
  const [input, setInput] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [allTerminales, setAllTerminales] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const isUserInput = useRef(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Exponer métodos del input interno al componente padre
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    select: () => inputRef.current?.select()
  }));

  useEffect(() => {
    // Carga los terminales desde el backend con ciudades y terminales agrupados
    fetch('http://localhost:8000/ciudades-terminales')
      .then(res => res.json())
      .then(data => {
        console.log('Datos recibidos:', data); // Debug
        if (data.success) {
          // Transformar los datos a la estructura esperada
          const terminalData = data.data.map(ciudad => ({
            ciudad: ciudad.nombre,
            terminales: ciudad.terminales.map(terminal => terminal.nombre)
          }));
          setAllTerminales(terminalData);
        }
      })
      .catch(err => {
        // Fallback con datos vacíos
        setAllTerminales([]);
      });
  }, []);

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
      if (onChange && isUserInput.current) onChange('', '');
      return;
    }
    
    // NUEVO: Verificar si el input actual es una selección válida completa
    const esSeleccionCompleta = allTerminales.some(ciudad => 
      ciudad.terminales.some(terminal => 
        input === `${ciudad.ciudad} (${terminal})`
      )
    );
    
    // Si es una selección completa válida, no mostrar sugerencias ni mensaje de error
    if (esSeleccionCompleta && !isUserInput.current) {
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }
    
    const lowerInput = input.toLowerCase();
    
    // MEJORADO: Extraer términos de búsqueda del input
    // Si el input tiene formato "Ciudad (Terminal)", extraer ambas partes
    let searchTerms = [lowerInput];
    const match = input.match(/^(.+?)\s*\((.+?)\)\s*$/);
    if (match) {
      const [, ciudad, terminal] = match;
      searchTerms = [
        ciudad.trim().toLowerCase(),
        terminal.trim().toLowerCase(),
        lowerInput // También mantener la búsqueda completa
      ];
    }
    
    // Busca por cualquiera de los términos extraídos
    const filtered = allTerminales.flatMap(t =>
      t.terminales
        .filter(terminal => {
          return searchTerms.some(term => 
            t.ciudad.toLowerCase().includes(term) ||
            terminal.toLowerCase().includes(term)
          );
        })
        .map(terminal => ({
          ciudad: t.ciudad,
          terminal,
          searchTerm: searchTerms[0] // Usar el primer término para el resaltado
        }))
    );
    
    setSuggestions(filtered);
    setIsOpen(true);
    setSelectedIndex(-1);
  }, [input, allTerminales]);

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
    setInput(`${ciudad} (${terminal})`);
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onChange) onChange(ciudad, terminal);
    
    // Pasar el focus al siguiente input si existe la referencia
    if (nextInputRef && nextInputRef.current) {
      setTimeout(() => {
        // Si nextInputRef es otro AutocompleteTerminal con forwardRef
        if (nextInputRef.current.focus) {
          nextInputRef.current.focus();
        } else {
          // Si es un input normal
          nextInputRef.current.focus();
        }
      }, 100);
    } else if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    
    // Si no hay sugerencias, solo permitir Escape
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

    // Si hay sugerencias, permitir navegación completa
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
    
    // NUEVO: Solo abrir si no es una selección válida completa
    const esSeleccionCompleta = allTerminales.some(ciudad => 
      ciudad.terminales.some(terminal => 
        input === `${ciudad.ciudad} (${terminal})`
      )
    );
    
    if (input.length > 0 && !esSeleccionCompleta) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Retrasar el cierre para permitir clicks en las sugerencias
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 150);
  };

  return (
    <div className="autocomplete-terminal">
      <input
        ref={inputRef}
        type="text"
        placeholder="Escribe ciudad o terminal"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="autocomplete-input"
        autoComplete="off"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
      />
      
      {/* Lista de sugerencias cuando hay resultados */}
      {isOpen && suggestions.length > 0 && (
        <ul 
          ref={listRef}
          className="autocomplete-listbox" 
          role="listbox"
        >
          {suggestions.map((s, idx) => (
            <li
              key={`${s.ciudad}-${s.terminal}-${idx}`}
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
                {highlightMatch(s.terminal, s.searchTerm)}
              </span>
              <span className="separator">)</span>
            </li>
          ))}
        </ul>
      )}

      {/* Mensaje cuando no hay resultados */}
      {isOpen && input.length > 0 && suggestions.length === 0 && allTerminales.length > 0 && (
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
        {isOpen && suggestions.length > 0 && 
          `${suggestions.length} sugerencias disponibles. Use las flechas para navegar y Enter para seleccionar.`
        }
        {isOpen && input.length > 0 && suggestions.length === 0 && allTerminales.length > 0 &&
          `No se encontraron resultados para "${input}"`
        }
      </div>
    </div>
  );
});

// Agregar displayName para debugging
AutocompleteTerminal.displayName = 'AutocompleteTerminal';

export default AutocompleteTerminal;