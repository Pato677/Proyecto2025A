import React, { useState } from 'react';
import PaginacionPanel from './PaginacionPanel';
import '../Estilos/SuperAdminDashboard.css';

const RutasPanel = () => {
  const [rutas, setRutas] = useState([
    { id: 1, origen: 'Quito', destino: 'Guayaquil', paradas: 'Santo Domingo, Quevedo' },
    { id: 2, origen: 'Quito', destino: 'Cuenca', paradas: 'Riobamba, Azogues' }
  ]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;
  const totalPaginas = Math.ceil(rutas.length / porPagina);
  const rutasPagina = rutas.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
    <div className="panel-box">
      <h3>Rutas</h3>
      <table className="panel-table">
        <thead>
          <tr>
            <th>Origen</th>
            <th>Destino</th>
            <th>Paradas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rutasPagina.map(r => (
            <tr key={r.id}>
              <td>{r.origen}</td>
              <td>{r.destino}</td>
              <td>{r.paradas}</td>
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
      <button className="btn-agregar">Agregar Ruta</button>
    </div>
  );
};

export default RutasPanel;