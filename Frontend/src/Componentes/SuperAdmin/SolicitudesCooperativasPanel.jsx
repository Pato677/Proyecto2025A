import React from 'react';
import '../Estilos/SuperAdminDashboard.css';

const SolicitudesCooperativasPanel = () => (
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
        {/* Aquí iría el mapeo de solicitudes */}
        <tr>
          <td>Cooperativa Ejemplo</td>
          <td>1234567890</td>
          <td>ejemplo@coop.com</td>
          <td>
            <button className="btn-outline">Aceptar</button>
            <button className="btn-eliminar">Rechazar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default SolicitudesCooperativasPanel;