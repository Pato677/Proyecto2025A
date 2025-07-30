import React from 'react';
import './Estilos/RoutesTable.css';

const RoutesTable = ({ rutas, selectedId, setSelectedId, onViewRoute, onEditRoute, loading }) => (
  <div className="routes-table-container">
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
        {loading ? (
          <tr>
            <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
              <div className="loading-spinner">Cargando rutas...</div>
            </td>
          </tr>
        ) : rutas.length > 0 ? (
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
              <td>
                <div className="actions-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewRoute(ruta);
                    }}
                    title="Ver paradas"
                    className="action-button view-button"
                    disabled={loading}
                  >
                    👁️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditRoute(ruta);
                    }}
                    title="Editar paradas en mapa"
                    className="action-button edit-button"
                    disabled={loading}
                  >
                    🗺️
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
              <div className="no-data">
                <p>No hay rutas registradas</p>
                <small>Utiliza el botón "Agregar" para crear una nueva ruta</small>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default RoutesTable;