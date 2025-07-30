import React, { useState } from 'react';
import PaginacionPanel from './PaginacionPanel';
import '../Estilos/SuperAdminDashboard.css';

const HorariosPanel = () => {
  const [horarios] = useState([
    { id: 1, ruta: 'Quito - Guayaquil', salida: '08:00', llegada: '16:00' },
    { id: 2, ruta: 'Quito - Cuenca', salida: '09:00', llegada: '17:00' }
  ]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;
  const totalPaginas = Math.ceil(horarios.length / porPagina);
  const horariosPagina = horarios.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
    <div className="panel-box">
      <h3>Horarios</h3>
      <table className="panel-table">
        <thead>
          <tr>
            <th>Ruta</th>
            <th>Hora Salida</th>
            <th>Hora Llegada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {horariosPagina.map(h => (
            <tr key={h.id}>
              <td>{h.ruta}</td>
              <td>{h.salida}</td>
              <td>{h.llegada}</td>
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
      <button className="btn-agregar">Agregar Horario</button>
    </div>
  );
};

export default HorariosPanel;