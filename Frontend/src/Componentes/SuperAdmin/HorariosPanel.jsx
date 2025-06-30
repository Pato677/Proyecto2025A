import React, { useState } from 'react';
import '../Estilos/SuperAdminDashboard.css';

const HorariosPanel = () => {
  const [horarios, setHorarios] = useState([
    { id: 1, ruta: 'Quito - Guayaquil', salida: '08:00', llegada: '16:00' },
    { id: 2, ruta: 'Quito - Cuenca', salida: '09:00', llegada: '17:00' }
  ]);
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
          {horarios.map(h => (
            <tr key={h.id}>
              <td>{h.ruta}</td>
              <td>{h.salida}</td>
              <td>{h.llegada}</td>
              <td>
                <button className="btn-outline">Editar</button>
                <button className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-agregar">Agregar Horario</button>
    </div>
  );
};

export default HorariosPanel;