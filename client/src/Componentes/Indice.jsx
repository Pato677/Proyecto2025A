import React from 'react';
import { Link } from 'react-router-dom';
import './Estilos/Indice.css';

const Indice = () => {
  return (
    <div className="indice-container">
      <h2>Índice de Navegación</h2>
      <ul className="indice-list">
        <li>
          <Link className="indice-link" to="/Inicio">🏠 Página de Inicio</Link>
        </li>
        <li>
          <Link className="indice-link" to="/Login">🔑 Login</Link>
        </li>
        <li>
          <Link className="indice-link" to="/PasajeroForm">👤 Registrar Usuario</Link>
        </li>
        <li>
          <Link className="indice-link" to="/RegistroCooperativa">🏢 Registrar Cooperativa</Link>
        </li>
        <li>
          <Link className="indice-link" to="/SeleccionViaje">🚌 Selección de Viaje</Link>
        </li>
        <li>
          <Link className="indice-link" to="/RegistroPasajerosPage">👥 Registro de Pasajeros</Link>
        </li>
        <li>
          <Link className="indice-link" to="/SeleccionAsientosPage">💺 Selección de Asientos</Link>
        </li>
        <li>
          <Link className="indice-link" to="/FormasDePagoPage">💳 Formas de Pago</Link>
        </li>
        <li>
          <Link className="indice-link" to="/TicketPage">🎫 Ticket (Boleto)</Link>
        </li>
        <li>
          <Link className="indice-link" to="/RealTimeMap">🗺️ Mapa en Tiempo Real</Link>
        </li>
        <li>
          <Link className="indice-link" to="/DashboardAdmin">📊 Dashboard Administrador</Link>
        </li>
        <li>
          <Link className="indice-link" to="/SuperAdmin">⚡ Dashboard Super Administrador</Link>
        </li>
        <li>
          <Link className="indice-link" to="/RegisterUnits">🚌 Registrar Unidades</Link>
        </li>
        <li>
          <Link className="indice-link" to="/ConductoresPage">👨‍✈️ Gestión de Conductores</Link>
        </li>
        <li>
          <Link className="indice-link" to="/RutasPanel">🗺️ Tabla de Rutas</Link>
        </li>
        <li>
          <Link className="indice-link" to="/RutaForm">📝 Formulario de Ruta</Link>
        </li>
      </ul>
    </div>
  );
};

export default Indice;