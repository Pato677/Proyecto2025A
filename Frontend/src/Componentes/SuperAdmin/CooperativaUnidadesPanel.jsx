import React from 'react';
import '../Estilos/SuperAdminDashboard.css';

const CooperativaUnidadesPanel = () => (
  <div className="panel-box">
    <h3>Unidades de la Cooperativa</h3>
    <table className="panel-table">
      <thead>
        <tr>
          <th>Placa</th>
          <th>N° Unidad</th>
          <th>Conductor</th>
          <th>Controlador</th>
          <th>Pisos</th>
          <th>Asientos</th>
        </tr>
      </thead>
      <tbody>
        {/* Aquí iría el mapeo de unidades */}
        <tr>
          <td>ABC1234</td>
          <td>10</td>
          <td>Pedro Gómez</td>
          <td>Lucía Herrera</td>
          <td>2</td>
          <td>54</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default CooperativaUnidadesPanel;