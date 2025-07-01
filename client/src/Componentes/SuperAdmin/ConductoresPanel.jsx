import React, { useState } from 'react';
import PaginacionPanel from './PaginacionPanel';
import '../Estilos/SuperAdminDashboard.css';

const ConductoresPanel = () => {
  // Ejemplo de muchos conductores
  const [conductores] = useState([
    { id: 1, nombre: 'Juan Pérez', cedula: '0102030405', telefono: '0999999999' },
    { id: 2, nombre: 'Pedro Gómez', cedula: '0605040302', telefono: '0988888888' },
    { id: 3, nombre: 'Luis Torres', cedula: '0807060504', telefono: '0977777777' },
    { id: 4, nombre: 'Carlos Ruiz', cedula: '0908070605', telefono: '0966666666' },
    { id: 5, nombre: 'Mario López', cedula: '1009080706', telefono: '0955555555' },
    { id: 6, nombre: 'Ana Ríos', cedula: '1109080706', telefono: '0944444444' },
    { id: 7, nombre: 'Sofía León', cedula: '1209080706', telefono: '0933333333' },
    { id: 8, nombre: 'Miguel Vera', cedula: '1309080706', telefono: '0922222222' },
    { id: 9, nombre: 'Patricia Paz', cedula: '1409080706', telefono: '0911111111' },
    { id: 10, nombre: 'Esteban Gil', cedula: '1509080706', telefono: '0900000000' }
  ]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;
  const totalPaginas = Math.ceil(conductores.length / porPagina);
  const conductoresPagina = conductores.slice((pagina - 1) * porPagina, pagina * porPagina);

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
          {conductoresPagina.map(c => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.cedula}</td>
              <td>{c.telefono}</td>
              <td>
                <button className="btn-outline" title="Editar">✏️</button>
                <button className="btn-eliminar" title="Eliminar">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginacionPanel
        paginaActual={pagina}
        totalPaginas={totalPaginas}
        onChange={setPagina}
      />
      <button className="btn-agregar">Agregar Conductor</button>
    </div>
  );
};

export default ConductoresPanel;