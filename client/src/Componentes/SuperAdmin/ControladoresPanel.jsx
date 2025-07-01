import React, { useState } from 'react';
import PaginacionPanel from './PaginacionPanel';
import '../Estilos/SuperAdminDashboard.css';

const ControladoresPanel = () => {
  const [controladores, setControladores] = useState([
    { id: 1, nombre: 'Martha Díaz', cedula: '1102938475', telefono: '0977777777' },
    { id: 2, nombre: 'Lucía Herrera', cedula: '1203948576', telefono: '0966666666' }
  ]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;
  const totalPaginas = Math.ceil(controladores.length / porPagina);
  const controladoresPagina = controladores.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
    <div className="panel-box">
      <h3>Controladores</h3>
      <table className="panel-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {controladoresPagina.map(c => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.cedula}</td>
              <td>{c.telefono}</td>
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
      <button className="btn-agregar">Agregar Controlador</button>
    </div>
  );
};

export default ControladoresPanel;