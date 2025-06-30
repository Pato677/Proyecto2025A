import React, { useState } from 'react';
import '../Estilos/SuperAdminDashboard.css';

const ConductoresPanel = () => {
  const [conductores, setConductores] = useState([
    { id: 1, nombre: 'Juan Pérez', cedula: '0102030405', telefono: '0999999999' },
    { id: 2, nombre: 'Pedro Gómez', cedula: '0605040302', telefono: '0988888888' }
  ]);
  return (
    <div className="panel-box">
      <h3>Conductores</h3>
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
          {conductores.map(c => (
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
      <button className="btn-agregar">Agregar Conductor</button>
    </div>
  );
};

export default ConductoresPanel;