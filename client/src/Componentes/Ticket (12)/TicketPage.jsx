import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import TicketInfo from './TicketInfo';
import '../Estilos/Ticket.css';
import Button from '../Button';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';

function TicketPage() {
  const [searchParams] = useSearchParams();
  const compraId = searchParams.get('compraId') || 'N/A';

  const [compra, setCompra] = useState(null);
  const [boletoIndex, setBoletoIndex] = useState(0);
  const [viaje, setViaje] = useState(null);
  const [qrLoaded, setQrLoaded] = useState(false); // Estado para controlar la carga del QR

  // Mueve el useRef aquí, junto con los otros hooks
  const ticketRef = React.useRef();

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

  //const qrString = boletoActual && viaje && compra
  const qrString = "Holi"
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

  const handleImprimir = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text('Boleto de Viaje', 105, 20, { align: 'center' });

    // Información principal
    doc.setFontSize(12);
    doc.text(`Cooperativa: ${datosViaje.cooperativa}`, 20, 40);
    doc.text(`Viaje: ${datosViaje.origen} - ${datosViaje.destino}`, 20, 50);
    doc.text(`Salida: ${datosViaje.horaSalida} - Llegada: ${datosViaje.horaLlegada}`, 20, 60);
    doc.text(`Bus N°: ${datosViaje.busNumero}`, 20, 70);
    doc.text(`Fecha de viaje: ${datosViaje.fecha}`, 20, 80);
    doc.text(`Pasajero: ${boletoActual.Pasajero?.nombres || ''} ${boletoActual.Pasajero?.apellidos || ''}`, 20, 90);
    doc.text(`Cédula: ${boletoActual.Pasajero?.cedula || ''}`, 20, 100);
    doc.text(`Asiento: ${datosViaje.asiento}`, 20, 110);
    doc.text(`Código Boleto: ${datosViaje.codigoBoleto}`, 20, 120);

    // Instrucciones
    doc.setFontSize(10);
    doc.text('Presente este código como su boleto para ingresar en la unidad de transporte.', 20, 140);
    doc.text('Obtendrá una copia del mismo directamente a su correo electrónico.', 20, 146);

    // QR: Carga la imagen y agrégala al PDF
    const qrImg = document.querySelector('.ticket-qr');
    if (qrImg && qrImg.src) {
      // Carga la imagen como base64 y agrégala
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        // Agrega el QR al PDF (x, y, width, height)
        doc.addImage(img, 'PNG', 140, 40, 50, 50);
        doc.save(`boleto_${boletoActual?.codigo || 'ticket'}.pdf`);
      };
      img.src = qrImg.src;
    } else {
      doc.save(`boleto_${boletoActual?.codigo || 'ticket'}.pdf`);
    }
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrString)}}`;

  return (
    <div className="ticket-page">
      <Header currentStep={5} totalSteps={5} />
      <main className="ticket-main" ref={ticketRef}>
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
            src={qrUrl}
            alt="QR Code"
            className="ticket-qr"
            onLoad={() => {
              console.log("QR cargadooo");
              setQrLoaded(true);
            }}
            onError={() => {
              console.error("Error cargando el QR");
            }}
          />
        </div>
        <p className="ticket-instructions">
          Presente este código como su boleto para ingresar en la unidad de transporte.<br />
          Obtendrá una copia del mismo directamente a su correo electrónico.
        </p>
        <div className="ticket-button-group">
          <Button text="Atras" width='150px'/>
          <Button text="Imprimir" width='150px' onClick={handleImprimir}/>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TicketPage;