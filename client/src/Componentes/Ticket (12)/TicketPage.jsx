import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import TicketInfo from './TicketInfo';
import '../Estilos/Ticket.css';
import Button from '../Button';

function TicketPage() {
  const [searchParams] = useSearchParams();
  const compraId = searchParams.get('compraId') || 'N/A';

  const [compra, setCompra] = useState(null);
  const [boletoIndex, setBoletoIndex] = useState(0);
  const [viaje, setViaje] = useState(null);

  useEffect(() => {
    if (compraId && compraId !== 'N/A') {
      fetch(`http://localhost:8000/api/compras/${compraId}`)
        .then(res => res.json())
        .then(data => {
          
          setCompra(data.data); // Asegúrate de usar data.data si tu backend responde con { success, data }
        });
    }
  }, [compraId]);

  useEffect(() => {
    if (compra && compra.Boletos && compra.Boletos.length > 0) {
      const viajeId = compra.viaje_id || (compra.Viaje && compra.Viaje.id);
      console.log("Intentando cargar viaje con id:", viajeId);
      if (viajeId) {
        fetch(`http://localhost:8000/viajes/${viajeId}`)
          .then(res => res.json())
          .then(data => {
            
            setViaje(data.data);
          });
      }
    }
  }, [compra]);

  if (!compra || !viaje) {
    return <div>Cargando...</div>;
  }

  const boletos = compra.Boletos || [];
  const boletoActual = boletos[boletoIndex];

  // Prepara los datos para TicketInfo
  const datosViaje = boletoActual
    ? {
        cooperativa: viaje.ruta?.UsuarioCooperativa?.razon_social || '',
        origen: viaje.ruta?.terminalOrigen?.ciudad?.nombre || '',
        destino: viaje.ruta?.terminalDestino?.ciudad?.nombre || '',
        horaSalida: viaje.ruta?.hora_salida || '',
        horaLlegada: viaje.ruta?.hora_llegada || '',
        busNumero: viaje.unidad?.numero_unidad || '',
        fecha: viaje.fecha_salida || '',
        pasajero: boletoActual.Pasajero?.nombre || '',
        asiento: boletoActual.asiento || '',
        codigoBoleto: boletoActual.codigo || '',
      }
    : {};

  const qrString = boletoActual && viaje && compra
    ? [
        `Boleto: ${boletoActual.codigo}`,
        `Pasajero: ${boletoActual.Pasajero?.nombres || compra.Pasajero?.nombres || ''} ${boletoActual.Pasajero?.apellidos || compra.Pasajero?.apellidos || ''}`,
        `Cédula: ${boletoActual.Pasajero?.cedula || compra.Pasajero?.cedula || ''}`,
        `Salida: ${viaje.fecha_salida ? new Date(viaje.fecha_salida).toLocaleString() : ''}`,
        `Origen: ${viaje.ruta?.terminalOrigen?.ciudad?.nombre || ''}`,
        `Destino: ${viaje.ruta?.terminalDestino?.ciudad?.nombre || ''}`,
        `Cooperativa: ${viaje.ruta?.UsuarioCooperativa?.razon_social || ''}`,
        `Bus: ${viaje.unidad?.numero_unidad || ''}`,
        `Asiento: ${boletoActual.asiento || ''}`
      ].join('\n')
    : '';

  return (
    <div className="ticket-page">
      <Header currentStep={5} totalSteps={5} />
      <main className="ticket-main">
        <div className="ticket-info-box">
          <TicketInfo datosViaje={datosViaje} />
          <div className="boleto-navegacion">
            {boletos.length > 1 && (
              <>
                <button
                  onClick={() => setBoletoIndex(i => Math.max(i - 1, 0))}
                  disabled={boletoIndex === 0}
                >
                  ←
                </button>
                <span>
                  Boleto {boletoIndex + 1} de {boletos.length}
                </span>
                <button
                  onClick={() => setBoletoIndex(i => Math.min(i + 1, boletos.length - 1))}
                  disabled={boletoIndex === boletos.length - 1}
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
        <div className="ticket-qr-section">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrString)}`}
            alt="QR Code"
            className="ticket-qr"
          />
        </div>
        <p className="ticket-instructions">
          Presente este código como su boleto para ingresar en la unidad de transporte.<br />
          Obtendrá una copia del mismo directamente a su correo electrónico.
        </p>
        <div className="ticket-button-group">
          <Button text="Atras" width='150px'/>
          <Button text="Imprimir" width='150px'/>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TicketPage;