import React, { useState } from 'react';
import '../Estilos/SuperAdminDashboard.css';

const CiudadesTerminalesPanel = () => {
  // Aquí iría la lógica de CRUD (fetch, add, edit, delete)
  // Ejemplo de tabla simple:
  const [ciudades, setCiudades] = useState([
    { id: 1, nombre: 'Quito', terminal: 'Quitumbe' },
    { id: 2, nombre: 'Guayaquil', terminal: 'Terminal Terrestre' }
  ]);
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
          {ciudades.map(c => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.terminal}</td>
              <td>
                <button className="btn-outline">Editar</button>
                <button className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-agregar">Agregar Ciudad/Terminal</button>
    </div>
  );
};

export default CiudadesTerminalesPanel;