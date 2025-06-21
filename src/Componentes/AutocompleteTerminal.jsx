import React, { useState, useEffect } from 'react';
import './Estilos/AutocompleteTerminal.css'; 
const AutocompleteTerminal = ({ value, onChange }) => {
  const [input, setInput] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [allTerminales, setAllTerminales] = useState([]);

  useEffect(() => {
    // Carga los terminales desde el backend (json-server)
    fetch('http://localhost:3000/TerminalesInterprovinciales')
      .then(res => res.json())
      .then(data => setAllTerminales(data));
  }, []);

  useEffect(() => {
    if (input.length === 0) {
      setSuggestions([]);
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
  }, [input, allTerminales]);

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
        onChange={e => setInput(e.target.value)}
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