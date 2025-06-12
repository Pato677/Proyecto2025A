import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Indice = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <h2>Índice de Navegación</h2>
      <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.1rem' }}>
        <li>
          <Link to="/Inicio">🏠 Página de Inicio</Link>
        </li>
        <li>
          <Link to="/Login">🔑 Login</Link>
        </li>
        <li>
          <Link to="/PasajeroForm">🛣️ Registrar Pasajero</Link>
        </li>
        <li>
          <Link to="/RegistroCooperativa">🛣️ Registrar Cooperativa</Link>
        </li>
        <li>
          <Link to="/TripSelectionPage">🚌 Selección de Viaje</Link>
        </li>
        <li>
          <Link to="/RegistroPasajerosPage">👤 Registro de Pasajeros</Link>
        </li>
        <li>
          <Link to="/SeleccionAsientosPage">💺 Selección de Asientos</Link>
        </li>
        <li>
          <Link to="/TablaPasajeros">📋 Tabla de Pasajeros</Link>
        </li>
        <li>
          <Link to="/TicketPage">🎫 Ticket (Boleto)</Link>
        </li>
        <li>
          <Link to="/RealTimeMap">🗺️ Mapa en Tiempo Real</Link>
        </li>
        <li>
          <Link to="/DashboardAdmin">📊 Dashboard Administrador</Link>
        </li>
        <li>
          <Link to="/RegisterUnits">🚌 Registrar Unidades</Link>
        </li>
        <li>
          <Link to="/RutasPanel">🗺️ Tabla de Rutas</Link>
        </li>
        <li>
          <Link to="/RutaForm">📝 Formulario de Ruta</Link>
        </li>
      </ul>
    </div>
  );
};

export default Indice;