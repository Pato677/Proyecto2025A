import React, { useState } from "react";
import "./Estilos/ModalRastreoBoleto.css";

const ModalRastreoBoleto = ({ open, onClose }) => {
  const [numeroBoleto, setNumeroBoleto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // 'error' | 'info'

  if (!open) return null;

  const handleBuscar = () => {
    if (!numeroBoleto.trim()) {
      setMensaje("Por favor ingresa un número de boleto.");
      setTipoMensaje("error");
      return;
    }
    if (!/^\d+$/.test(numeroBoleto.trim())) {
      setMensaje("El número de boleto solo debe contener dígitos.");
      setTipoMensaje("error");
      return;
    }
    if (numeroBoleto.trim().length < 4) {
      setMensaje("Debe ingresar un formato de boleto válido (mínimo 4 dígitos).");
      setTipoMensaje("error");
      return;
    }
    // Aquí podrías agregar más validaciones si lo necesitas

    setMensaje("Buscando boleto...");
    setTipoMensaje("info");
    // Simula búsqueda (puedes reemplazar esto por tu lógica real)
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
        <input
          type="text"
          placeholder="Número de boleto"
          value={numeroBoleto}
          onChange={e => {
            setNumeroBoleto(e.target.value);
            setMensaje("");
            setTipoMensaje("");
          }}
        />
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