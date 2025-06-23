import React from 'react';

const RoutesTable = ({ rutas, selectedId, setSelectedId }) => (
  <table className="rutas-table">
    <thead>
      <tr>
        <th>Número de Ruta</th>
        <th>Ciudad Origen</th>
        <th>Terminal Origen</th>
        <th>Ciudad Destino</th>
        <th>Terminal Destino</th>
        <th>Hora Salida</th>
        <th>Hora Llegada</th>
        <th>Paradas</th>
      </tr>
    </thead>
    <tbody>
      {rutas.length > 0 ? (
        rutas.map((ruta) => (
          <tr
            key={ruta.id}
            className={selectedId === ruta.id ? 'selected-row' : ''}
            onClick={() => setSelectedId(ruta.id)}
            style={{ cursor: 'pointer' }}
          >
            <td>{ruta.numeroRuta}</td>
            <td>{ruta.ciudadOrigen}</td>
            <td>{ruta.terminalOrigen}</td>
            <td>{ruta.ciudadDestino}</td>
            <td>{ruta.terminalDestino}</td>
            <td>{ruta.horaSalida}</td>
            <td>{ruta.horaLlegada}</td>
            <td>{ruta.paradas}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={8} style={{ textAlign: 'center' }}>No hay rutas registradas</td>
        </tr>
      )}
    </tbody>
  </table>
);

export default RoutesTable;