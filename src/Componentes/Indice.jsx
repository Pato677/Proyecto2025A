import React from 'react';
import { Link } from 'react-router-dom';

const Indice = () => {
  return (
    <div>
      <h2>Índice de Componentes</h2>
      <ul>
        <li>
          <Link to="/Inicio">Inicio</Link>
        </li>
        <li>
          <Link to="/Login">Login</Link>
        </li>
        <li>
          <Link to="/TicketPage">Ticket Page</Link>
        </li>
        <li>
          <Link to="/RealTimeMap">Mapa</Link>
        </li>
        <li>
          <Link to="/DashboardAdmin">Dashboard Admin</Link>
        </li>
      </ul>
    </div>
  );
};

export default Indice;