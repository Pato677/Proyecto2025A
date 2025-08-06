import React from 'react';
import './Estilos/ViajesTable.css';

const ViajesTable = ({ viajes, selectedId, setSelectedId }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Agregar logs para debuggear
    console.log('📅 formatDate recibió:', dateString, 'tipo:', typeof dateString);
    
    // Si la fecha viene en formato YYYY-MM-DD, trabajar directamente con el string
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      console.log('📅 Fecha creada (caso YYYY-MM-DD):', fecha.toLocaleDateString());
      return fecha.toLocaleDateString();
    }
    
    // Si la fecha viene con hora (formato datetime), extraer solo la fecha
    if (typeof dateString === 'string' && dateString.includes('T')) {
      const fechaSolo = dateString.split('T')[0]; // Tomar solo la parte de la fecha
      const [year, month, day] = fechaSolo.split('-');
      const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      console.log('📅 Fecha creada (caso datetime):', fecha.toLocaleDateString());
      return fecha.toLocaleDateString();
    }
    
    // Si la fecha viene solo como YYYY-MM-DD pero dentro de un string más largo
    if (typeof dateString === 'string') {
      const match = dateString.match(/(\d{4}-\d{2}-\d{2})/);
      if (match) {
        const [year, month, day] = match[1].split('-');
        const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        console.log('📅 Fecha creada (caso regex):', fecha.toLocaleDateString());
        return fecha.toLocaleDateString();
      }
    }
    
    // Para otros formatos, usar el método original como último recurso
    const date = new Date(dateString);
    console.log('📅 Fecha creada (caso original):', date.toLocaleDateString());
    return date.toLocaleDateString();
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
