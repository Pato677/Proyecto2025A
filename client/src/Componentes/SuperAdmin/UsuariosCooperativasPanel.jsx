import React, { useState } from 'react';
import PaginacionPanel from './PaginacionPanel';
import '../Estilos/SuperAdminDashboard.css';

const UsuariosCooperativasPanel = () => {
  const [usuarios] = useState([
    { id: 1, tipo: 'Usuario', nombre: 'Juan Pérez', correo: 'juan@correo.com' },
    { id: 2, tipo: 'Cooperativa', nombre: 'Coop. Ejemplo', correo: 'coop@correo.com' },
    // ...agrega más datos según sea necesario
  ]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;
  const totalPaginas = Math.ceil(usuarios.length / porPagina);
  const usuariosPagina = usuarios.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
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
          {usuariosPagina.map(u => (
            <tr key={u.id}>
              <td>{u.tipo}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
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
    </div>
  );
};

export default UsuariosCooperativasPanel;