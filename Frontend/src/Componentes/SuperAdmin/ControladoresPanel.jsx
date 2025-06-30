import React, { useState } from 'react';
import '../Estilos/SuperAdminDashboard.css';

const ControladoresPanel = () => {
  const [controladores, setControladores] = useState([
    { id: 1, nombre: 'Martha Díaz', cedula: '1102938475', telefono: '0977777777' },
    { id: 2, nombre: 'Lucía Herrera', cedula: '1203948576', telefono: '0966666666' }
  ]);
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
          {controladores.map(c => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.cedula}</td>
              <td>{c.telefono}</td>
              <td>
                <button className="btn-outline">Editar</button>
                <button className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-agregar">Agregar Controlador</button>
    </div>
  );
};

export default ControladoresPanel;