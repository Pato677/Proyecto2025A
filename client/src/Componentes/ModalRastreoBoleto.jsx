import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Estilos/ModalRastreoBoleto.css";

const ModalRastreoBoleto = ({ open, onClose }) => {
  const [input, setInput] = useState(""); // Solo lo que el usuario escribe
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // 'error' | 'info'
  const navigate = useNavigate();

  // Limpiar campos al cerrar el modal
  useEffect(() => {
    if (!open) {
      setInput("");
      setMensaje("");
      setTipoMensaje("");
    }
  }, [open]);

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

  const handleBuscar = async () => {
    const boletoCompleto = `BOL-${formatBoleto(input)}`;
    if (!input.trim() || formatBoleto(input).length < 13) {
      setMensaje("Debe ingresar un número de boleto válido (BOL-XXXXXX-XXXXXX).");
      setTipoMensaje("error");
      return;
    }
    setMensaje("Buscando boleto...");
    setTipoMensaje("info");
    try {
      const res = await fetch(`http://localhost:8000/boletos/${boletoCompleto}`);
      if (!res.ok) {
        setMensaje("Boleto no encontrado.");
        setTipoMensaje("error");
        return;
      }
      const data = await res.json();
      if (data && data.compra_id) {
        // Redirige a TicketPage con el compraId
        navigate(`/TicketPage?compraId=${data.compra_id}`);
      } else {
        setMensaje("No se encontró el boleto o no tiene compra asociada.");
        setTipoMensaje("error");
      }
    } catch (error) {
      setMensaje("Error al buscar el boleto.");
      setTipoMensaje("error");
    }
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