import React, { useState } from 'react';
import '../Estilos/SuperAdminDashboard.css';

const RutasPanel = () => {
  const [rutas, setRutas] = useState([
    { id: 1, origen: 'Quito', destino: 'Guayaquil', paradas: 'Santo Domingo, Quevedo' },
    { id: 2, origen: 'Quito', destino: 'Cuenca', paradas: 'Riobamba, Azogues' }
  ]);
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
          {rutas.map(r => (
            <tr key={r.id}>
              <td>{r.origen}</td>
              <td>{r.destino}</td>
              <td>{r.paradas}</td>
              <td>
                <button className="btn-outline">Editar</button>
                <button className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-agregar">Agregar Ruta</button>
    </div>
  );
};

export default RutasPanel;