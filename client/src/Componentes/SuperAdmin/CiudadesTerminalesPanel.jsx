import React, { useState } from 'react';
import PaginacionPanel from './PaginacionPanel';
import '../Estilos/SuperAdminDashboard.css';

const CiudadesTerminalesPanel = () => {
  const [ciudades] = useState([
    { id: 1, nombre: 'Quito', terminal: 'Quitumbe' },
    { id: 2, nombre: 'Guayaquil', terminal: 'Terminal Terrestre' }
  ]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;
  const totalPaginas = Math.ceil(ciudades.length / porPagina);
  const ciudadesPagina = ciudades.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
    <div className="panel-box">
      <h3>Ciudades y Terminales</h3>
      <table className="panel-table">
        <thead>
          <tr>
            <th>Ciudad</th>
            <th>Terminal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ciudadesPagina.map(c => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.terminal}</td>
              <td>
                <button className="btn-outline" title="Editar">✏️</button>
                <button className="btn-eliminar" title="Eliminar">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginacionPanel
        paginaActual={pagina}
        totalPaginas={totalPaginas}
        onChange={setPagina}
      />
      <button className="btn-agregar">Agregar Ciudad/Terminal</button>
    </div>
  );
};

export default CiudadesTerminalesPanel;