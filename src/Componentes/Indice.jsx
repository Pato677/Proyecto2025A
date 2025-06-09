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
        {/* Agrega más enlaces según tus componentes */}
      </ul>
    </div>
  );
};

export default Indice;