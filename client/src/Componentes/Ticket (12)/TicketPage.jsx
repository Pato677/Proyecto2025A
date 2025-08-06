import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import TicketInfo from './TicketInfo';
import '../Estilos/Ticket.css';
import Button from '../Button';
import jsPDF from 'jspdf';
import logo from '../Imagenes/Logo.png'; // Asegúrate de que la ruta sea correcta

function formatearFechaLarga(fechaStr) {
  if (!fechaStr) return '';
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const fecha = new Date(fechaStr);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();
  return `${dia} de ${mes} de ${anio}`;
}

function TicketPage() {
  const [searchParams] = useSearchParams();
  const compraId = searchParams.get('compraId') || 'N/A';
  const [boleto, setBoleto] = useState(null);
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



  if (!compra || !viaje ||boleto) {
    return <div>Cargando...</div>;
  }

  const boletos = compra.Boletos || [];
  const boletoActual = boletos[boletoIndex];

  // Datos del pasajero y asiento desde el backend
  const pasajero = boletoActual?.Pasajero || {};
  const asiento = boletoActual?.asiento_id || '';
  const codigoBoleto = boletoActual?.codigo || '';
  const cedula = pasajero?.cedula || '';
  const nombreCompleto = `${pasajero?.nombres || ''} ${pasajero?.apellidos || ''}`;


  // Datos de viaje desde la compra
  const viajes = boletoActual?.Compra?.Viaje || {};
  const busNumero = viajes?.unidad_id || '';
  const fechaSalida = viajes?.fecha_salida ? formatearFechaLarga(viajes.fecha_salida) : '';
  const fechaLlegada = viajes?.fecha_llegada ? formatearFechaLarga(viajes.fecha_llegada) : '';


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
        asiento: boletoActual.asiento_id || '', // <-- usa asiento_id
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
        `Asiento: ${boletoActual.asiento_id || ''}` 
      ].join('\n')
    : '';

  const handleImprimir = () => {
    const doc = new jsPDF();

    // COLORES DE MARCA
    const azulMarca = "#1e90ff"; // Cambia por tu azul de marca si es otro
    const grisClaro = "#f4f8fb";
    const grisOscuro = "#222";

    // Logo (mantén relación de aspecto)
    const logoWidth = 45;
    const logoHeight = 18;
    doc.addImage(logo, 'PNG', 15, 10, logoWidth, logoHeight);

    // Título principal
    doc.setFontSize(20);
    doc.setTextColor(30, 144, 255); // Azul marca
    doc.text('Boleto de Viaje', 105, 25, { align: 'center' });

    // Línea separadora azul
    doc.setDrawColor(30, 144, 255);
    doc.setLineWidth(1);
    doc.line(15, 32, 195, 32);

    // Fondo gris claro para la sección principal
    doc.setFillColor(244, 248, 251);
    doc.roundedRect(15, 35, 180, 60, 3, 3, 'F');

    // Datos del viaje
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = 43;
    doc.setFont(undefined, 'bold');
    doc.text('Cooperativa:', 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosViaje.cooperativa}`, 55, y);

    doc.setFont(undefined, 'bold');
    doc.text('Bus N°:', 120, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosViaje.busNumero}`, 140, y);

    y += 8;
    doc.setFont(undefined, 'bold');
    doc.text('Origen:', 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosViaje.origen}`, 45, y);

    doc.setFont(undefined, 'bold');
    doc.text('Destino:', 120, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosViaje.destino}`, 145, y);

    y += 8;
    doc.setFont(undefined, 'bold');
    doc.text('Salida:', 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosViaje.horaSalida}`, 45, y);

    doc.setFont(undefined, 'bold');
    doc.text('Llegada:', 120, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosViaje.horaLlegada}`, 145, y);

    y += 8;
    doc.setFont(undefined, 'bold');
    doc.text('Fecha de viaje:', 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(formatearFechaLarga(datosViaje.fecha), 60, y);

    // Sección pasajero con fondo azul claro
    y += 15;
    doc.setFillColor(225, 240, 255);
    doc.roundedRect(15, y - 6, 180, 32, 3, 3, 'F');
    doc.setFontSize(13);
    doc.setTextColor(30, 144, 255);
    doc.setFont(undefined, 'bold');
    doc.text('Datos del Pasajero', 20, y);

    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('Nombre:', 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(
      `${boletoActual.Pasajero?.nombres || compra.Pasajero?.nombres || ''} ${boletoActual.Pasajero?.apellidos || compra.Pasajero?.apellidos || ''}`,
      45, y
    );

    y += 8;
    doc.setFont(undefined, 'bold');
    doc.text('Cédula:', 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${boletoActual.Pasajero?.cedula || compra.Pasajero?.cedula || ''}`, 45, y);

    doc.setFont(undefined, 'bold');
    doc.text('Asiento:', 120, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${datosViaje.asiento}`, 145, y);

    y += 8;
    doc.setFont(undefined, 'bold');
    doc.text('Código Boleto:', 20, y);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(30, 144, 255);
    doc.text(`${datosViaje.codigoBoleto}`, 60, y);

    // QR debajo del código de boleto, centrado
    y += 10;
    const qrImg = document.querySelector('.ticket-qr');
    if (qrImg && qrImg.src) {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        doc.addImage(img, 'PNG', 80, y, 50, 50);

        // Instrucciones
        let yInstr = y + 60;
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.text('Presente este código como su boleto para ingresar en la unidad de transporte.', 20, yInstr);
        yInstr += 6;
        doc.text('Obtendrá una copia del mismo directamente a su correo electrónico.', 20, yInstr);

        // Contacto
        yInstr += 15;
        doc.setFontSize(10);
        doc.setTextColor(30, 144, 255);
        doc.textWithLink('¿Dudas o consultas? Contáctanos:', 20, yInstr, { url: 'mailto:info@transportesec.com' });
        yInstr += 6;
        doc.setTextColor(0, 0, 0);
        doc.text('Teléfono: 0999999999', 20, yInstr);
        doc.text('Email: info@transportesec.com', 80, yInstr);

        doc.save(`boleto_${boletoActual?.codigo || 'ticket'}.pdf`);
      };
      img.src = qrImg.src;
    } else {
      // Si no hay QR, igual muestra instrucciones y contacto
      y += 60;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text('Presente este código como su boleto para ingresar en la unidad de transporte.', 20, y);
      y += 6;
      doc.text('Obtendrá una copia del mismo directamente a su correo electrónico.', 20, y);

      y += 15;
      doc.setFontSize(10);
      doc.setTextColor(30, 144, 255);
      doc.textWithLink('¿Dudas o consultas? Contáctanos:', 20, y, { url: 'mailto:contacto@transportesec.com' });
      y += 6;
      doc.setTextColor(0, 0, 0);
      doc.text('Teléfono: +593 2 600 1234', 20, y);
      doc.text('Email: contacto@transportesec.com', 80, y);

      doc.save(`boleto_${boletoActual?.codigo || 'ticket'}.pdf`);
    }
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrString)}`;

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
          <Button text="Imprimir" width='150px' onClick={handleImprimir}/>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TicketPage;