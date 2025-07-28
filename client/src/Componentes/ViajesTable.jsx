import React from 'react';
import './Estilos/ViajesTable.css';

const ViajesTable = ({ viajes, selectedId, setSelectedId }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Solo mostrar la fecha, sin la hora
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (!viajes || viajes.length === 0) {
    return (
      <div className="table-container">
        <table className="viajes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha Salida</th>
              <th>Fecha Llegada</th>
              <th>Asientos Ocupados</th>
              <th>Precio</th>
              <th>Ruta</th>
              <th>Terminal Origen</th>
              <th>Terminal Destino</th>
              <th>Hora Salida</th>
              <th>Hora Llegada</th>
              <th>Unidad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="11" className="table-empty">
                <p>No hay viajes registrados</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="viajes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha Salida</th>
            <th>Fecha Llegada</th>
            <th>Asientos Ocupados</th>
            <th>Precio</th>
            <th>Ruta</th>
            <th>Terminal Origen</th>
            <th>Terminal Destino</th>
            <th>Hora Salida</th>
            <th>Hora Llegada</th>
            <th>Unidad</th>
          </tr>
        </thead>
        <tbody>
          {viajes.map((viaje) => (
            <tr
              key={viaje.id}
              className={selectedId === viaje.id ? 'selected' : ''}
              onClick={() => setSelectedId(viaje.id)}
            >
              <td>{viaje.id}</td>
              <td>{formatDate(viaje.fecha_salida)}</td>
              <td>{formatDate(viaje.fecha_llegada)}</td>
              <td>{viaje.asientos_ocupados_reales !== undefined ? viaje.asientos_ocupados_reales : (viaje.numero_asientos_ocupados || 0)}</td>
              <td>{formatPrice(viaje.precio)}</td>
              <td>
                {viaje.ruta?.numero_ruta || 'N/A'}
              </td>
              <td>
                {viaje.ruta?.terminalOrigen ? 
                  `${viaje.ruta.terminalOrigen.nombre || 'Terminal'} - ${viaje.ruta.terminalOrigen.ciudad?.nombre || 'Ciudad'}` : 
                  'N/A'
                }
              </td>
              <td>
                {viaje.ruta?.terminalDestino ? 
                  `${viaje.ruta.terminalDestino.nombre || 'Terminal'} - ${viaje.ruta.terminalDestino.ciudad?.nombre || 'Ciudad'}` : 
                  'N/A'
                }
              </td>
              <td>
                {viaje.ruta?.hora_salida || 'N/A'}
              </td>
              <td>
                {viaje.ruta?.hora_llegada || 'N/A'}
              </td>
              <td>
                {viaje.unidad?.numero || viaje.unidad?.placa || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViajesTable;
