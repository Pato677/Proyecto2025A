import React, { useState } from 'react';
import PaginacionPanel from './PaginacionPanel';
import '../Estilos/SuperAdminDashboard.css';

const SolicitudesCooperativasPanel = () => {
  const [solicitudes] = useState([
    { id: 1, nombre: 'Cooperativa Ejemplo', ruc: '1234567890', correo: 'ejemplo@coop.com' },
    // ...agrega más solicitudes si deseas
  ]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;
  const totalPaginas = Math.ceil(solicitudes.length / porPagina);
  const solicitudesPagina = solicitudes.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
    <div className="panel-box">
      <h3>Solicitudes de Cooperativas</h3>
      <table className="panel-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>RUC</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudesPagina.map(s => (
            <tr key={s.id}>
              <td>{s.nombre}</td>
              <td>{s.ruc}</td>
              <td>{s.correo}</td>
              <td>
                <button className="btn-outline" title="Aprobar">✔️</button>
                <button className="btn-eliminar" title="Rechazar">❌</button>
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
    </div>
  );
};

export default SolicitudesCooperativasPanel;