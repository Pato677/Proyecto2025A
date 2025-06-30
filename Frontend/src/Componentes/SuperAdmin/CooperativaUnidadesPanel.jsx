import React, { useState } from 'react';
import PaginacionPanel from './PaginacionPanel';
import '../Estilos/SuperAdminDashboard.css';

const CooperativaUnidadesPanel = () => {
  const [unidades] = useState([
    { id: 1, placa: 'ABC1234', numeroUnidad: 10, conductor: 'Pedro Gómez', controlador: 'Lucía Herrera', pisos: 2, asientos: 54 },
    // ...agrega más datos según sea necesario
  ]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;
  const totalPaginas = Math.ceil(unidades.length / porPagina);
  const unidadesPagina = unidades.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
    <div className="panel-box">
      <h3>Unidades de la Cooperativa</h3>
      <table className="panel-table">
        <thead>
          <tr>
            <th>Placa</th>
            <th>N° Unidad</th>
            <th>Conductor</th>
            <th>Controlador</th>
            <th>Pisos</th>
            <th>Asientos</th>
          </tr>
        </thead>
        <tbody>
          {unidadesPagina.map(u => (
            <tr key={u.id}>
              <td>{u.placa}</td>
              <td>{u.numeroUnidad}</td>
              <td>{u.conductor}</td>
              <td>{u.controlador}</td>
              <td>{u.pisos}</td>
              <td>{u.asientos}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginacionPanel
        paginaActual={pagina}
        totalPaginas={totalPaginas}
        onChange={setPagina}
      />
    </div>
  );
};

export default CooperativaUnidadesPanel;