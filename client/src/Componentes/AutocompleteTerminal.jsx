import React, { useState, useEffect, useRef } from 'react';
import './Estilos/AutocompleteTerminal.css'; 

const AutocompleteTerminal = ({ value, onChange }) => {
  const [input, setInput] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [allTerminales, setAllTerminales] = useState([]);
  const isUserInput = useRef(false);

  useEffect(() => {
    // Carga los terminales desde el backend con ciudades y terminales agrupados
    fetch('http://localhost:8000/ciudades-terminales')
      .then(res => res.json())
      .then(data => {
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
        console.error('Error al cargar terminales:', err);
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
      // Solo notifica al padre si el usuario borró el campo manualmente
      if (onChange && isUserInput.current) onChange('', '');
      return;
    }
    const lowerInput = input.toLowerCase();
    // Busca por ciudad o por terminal
    const filtered = allTerminales.flatMap(t =>
      t.terminales
        .filter(terminal =>
          t.ciudad.toLowerCase().includes(lowerInput) ||
          terminal.toLowerCase().includes(lowerInput)
        )
        .map(terminal => ({
          ciudad: t.ciudad,
          terminal
        }))
    );
    setSuggestions(filtered);
  }, [input, allTerminales, onChange]);

  const handleInputChange = e => {
    isUserInput.current = true;
    setInput(e.target.value);
  };

  const handleSelect = (ciudad, terminal) => {
    setInput(`${ciudad} (${terminal})`);
    setSuggestions([]);
    if (onChange) onChange(ciudad, terminal);
  };

  return (
    <div className="autocomplete-terminal">
      <input
        type="text"
        placeholder="Escribe ciudad o terminal"
        value={input}
        onChange={handleInputChange}
        onFocus={e => e.target.select()}
        className="autocomplete-input"
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="autocomplete-listbox">
          {suggestions.map((s, idx) => (
            <li
              key={s.ciudad + s.terminal + idx}
              className="autocomplete-item"
              onClick={() => handleSelect(s.ciudad, s.terminal)}
            >
              {s.ciudad} ({s.terminal})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteTerminal;