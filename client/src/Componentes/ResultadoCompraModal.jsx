import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Estilos/ResultadoCompraModal.css';

const ResultadoCompraModal = ({ 
  open, 
  onCerrar, 
  datosCompra, 
  datosViaje 
}) => {
  const navigate = useNavigate();
  if (!open || !datosCompra) return null;

  const { 
    codigoCompra, 
    totalPasajeros, 
    totalBoletos, 
    precioBase, 
    pasajeros 
  } = datosCompra;

  const calcularTotal = () => {
    if (pasajeros && pasajeros.length > 0) {
      return pasajeros.reduce((total, pasajero) => total + parseFloat(pasajero.precio || 0), 0).toFixed(2);
    }
    return (parseFloat(precioBase) * totalPasajeros).toFixed(2);
  };

  const handleAceptar = () => {
    // Navegar a TicketPage con el código de compra como parámetro
    if (codigoCompra) {
      navigate(`/TicketPage?codigoBoleto=${codigoCompra}`);
    } else {
      onCerrar();
    }
  };

  return (
    <div className="resultado-modal-bg">
      <div className="resultado-modal-content">
        <button className="resultado-modal-close" onClick={onCerrar}>×</button>
        
        <div className="resultado-icon">
          ✅
        </div>
        
        <h2 className="resultado-title">¡Compra Exitosa!</h2>
        
        <div className="resultado-info">
          <div className="resultado-section">
            <h3>Información de la Compra</h3>
            <div className="resultado-details">
              <p><strong>Código de Compra:</strong> <span className="codigo-compra">{codigoCompra}</span></p>
              <p><strong>Total de Pasajeros:</strong> {totalPasajeros}</p>
              <p><strong>Boletos Generados:</strong> {totalBoletos}</p>
              <p><strong>Total Pagado:</strong> <span className="precio-total">${calcularTotal()}</span></p>
            </div>
          </div>

          {datosViaje && (
            <div className="resultado-section">
              <h3>Información del Viaje</h3>
              <div className="resultado-details">
                <p><strong>Cooperativa:</strong> {datosViaje.cooperativa}</p>
                <p><strong>Ruta:</strong> {datosViaje.origen} → {datosViaje.destino}</p>
                <p><strong>Fecha:</strong> {new Date(datosViaje.fecha).toLocaleDateString()}</p>
                <p><strong>Hora de Salida:</strong> {datosViaje.horaSalida}</p>
                <p><strong>Unidad:</strong> {datosViaje.busNumero}</p>
              </div>
            </div>
          )}

          {pasajeros && pasajeros.length > 0 && (
            <div className="resultado-section">
              <h3>Pasajeros Registrados</h3>
              <div className="pasajeros-list">
                {pasajeros.map((pasajero, index) => (
                  <div key={index} className="pasajero-item">
                    <p><strong>{pasajero.nombres} {pasajero.apellidos}</strong></p>
                    <p>Asiento: {pasajero.asiento} | Precio: ${pasajero.precio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="resultado-warning">
            <p><strong>Importante:</strong> Guarde el código de compra para futuras referencias. 
            Este código le permitirá consultar su boleto y realizar check-in.</p>
          </div>
        </div>

        <div className="resultado-modal-btns">
          <button 
            type="button" 
            onClick={handleAceptar} 
            className="resultado-modal-accept"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultadoCompraModal;
