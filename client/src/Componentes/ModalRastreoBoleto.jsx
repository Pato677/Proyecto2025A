import React, { useState } from "react";
import "./Estilos/ModalRastreoBoleto.css";

const ModalRastreoBoleto = ({ open, onClose }) => {
  const [input, setInput] = useState(""); // Solo lo que el usuario escribe
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // 'error' | 'info'

  if (!open) return null;

  // Formatea el input para el formato BOL-XXXXXX-XXXXXX
  const formatBoleto = (value) => {
    let clean = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    clean = clean.slice(0, 12);
    if (clean.length > 0) {
      if (clean.length <= 6) {
        return clean;
      }
      // Si ya hay más de 6, inserta el guión después del sexto
      return clean.slice(0, 6) + '-' + clean.slice(6);
    }
    return clean;
  };

  const handleInputChange = (e) => {
    setMensaje("");
    setTipoMensaje("");
    setInput(formatBoleto(e.target.value));
  };

  const handleBuscar = () => {
    const boletoCompleto = `BOL-${formatBoleto(input)}`;
    if (!input.trim() || input.length < 13) {
      setMensaje("Debe ingresar un número de boleto válido (BOL-XXXXXX-XXXXXX).");
      setTipoMensaje("error");
      return;
    }
    setMensaje("Buscando boleto...");
    setTipoMensaje("info");
    // Aquí tu lógica real de búsqueda, usando boletoCompleto
    setTimeout(() => {
      setMensaje("Boleto no encontrado o función de rastreo aún no implementada.");
      setTipoMensaje("error");
    }, 1500);
  };

  return (
    <div className="modal-rastreo-overlay">
      <div className="modal-rastreo-contenido">
        <button className="modal-rastreo-cerrar" onClick={onClose}>×</button>
        <h3>Rastrea tu boleto</h3>
        <div className="modal-rastreo-input-row">
          <span>BOL-</span>
          <input
            type="text"
            placeholder="XXXXXX-XXXXXX"
            maxLength={13}
            value={formatBoleto(input)}
            onChange={handleInputChange}
          />
        </div>
        {mensaje && (
          <div className={`modal-rastreo-mensaje ${tipoMensaje}`}>
            {mensaje}
          </div>
        )}
        <button className="modal-rastreo-buscar" onClick={handleBuscar}>
          Buscar
        </button>
      </div>
    </div>
  );
};

export default ModalRastreoBoleto;