import React from 'react';
import './Estilos/Admin.css'; 

const sampleData = [
  { ruta: '15A25B1239', origen: 'UIO(Quitumbe)', destino: 'GYE(Sur)', salida: '22:00', llegada: '6:00', paradas: 6 }
];
const emptyRows = Array(4).fill({ ruta: '', origen: '', destino: '', salida: '', llegada: '', paradas: '' });
const RoutesTable = ({ onParadasClick }) => (
  <table className="rutas-table">
    <thead>
      <tr>
        <th>Nro de Ruta</th>
        <th>Origen</th>
        <th>Destino</th>
        <th>Hora de salida</th>
        <th>Hora estimada de llegada</th>
        <th>Paradas</th>
      </tr>
    </thead>
    <tbody>
      {[...sampleData, ...emptyRows].map((row, i) => (
        <tr key={i}>
          <td>{row.ruta}</td>
          <td>{row.origen}</td>
          <td>{row.destino}</td>
          <td>{row.salida}</td>
          <td>{row.llegada}</td>
          <td
            className={`paradas-cell${row.paradas ? '' : ' empty'}`}
            onClick={() => row.paradas && onParadasClick()}
          >
            {row.paradas}
            </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default RoutesTable;
