import React from 'react';
import '../Estilos/SuperAdminDashboard.css';

const UsuariosCooperativasPanel = () => (
  <div className="panel-box">
    <h3>Usuarios y Cooperativas</h3>
    <table className="panel-table">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {/* Aquí iría el mapeo de usuarios y cooperativas */}
        <tr>
          <td>Usuario</td>
          <td>Juan Pérez</td>
          <td>juan@correo.com</td>
          <td>
            <button className="btn-eliminar">Eliminar</button>
          </td>
        </tr>
        <tr>
          <td>Cooperativa</td>
          <td>Coop. Ejemplo</td>
          <td>coop@correo.com</td>
          <td>
            <button className="btn-outline">Ver Unidades</button>
            <button className="btn-eliminar">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default UsuariosCooperativasPanel;