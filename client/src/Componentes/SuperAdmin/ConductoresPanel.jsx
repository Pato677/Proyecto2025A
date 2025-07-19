import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PaginacionPanel from './PaginacionPanel';
import '../Estilos/SuperAdminDashboard.css';

const ConductoresPanel = () => {
  const [personal, setPersonal] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [filtroRol, setFiltroRol] = useState('todos'); // todos, conductor, controlador, ambos
  const porPagina = 5;
  
  // URL base consistente
  const API_URL = 'http://localhost:3000';

  // Cargar personal al inicio
  useEffect(() => {
    axios.get(`${API_URL}/conductores`)
      .then(res => {
        setPersonal(res.data);
      })
      .catch(err => {
        console.error('Error al cargar personal:', err);
        // Datos de ejemplo si falla la conexión
        setPersonal([
          { 
            id: 1, 
            nombre: 'Juan Pérez', 
            identificacion: '0102030405', 
            telefono: '0999999999',
            correo: 'juan.perez@email.com',
            tipoLicencia: 'Tipo A',
            roles: ['conductor']
          },
          { 
            id: 2, 
            nombre: 'Martha Díaz', 
            identificacion: '1102938475', 
            telefono: '0977777777',
            correo: 'martha.diaz@email.com',
            tipoLicencia: 'N/A',
            roles: ['controlador']
          },
          { 
            id: 3, 
            nombre: 'Carlos Ruiz', 
            identificacion: '0908070605', 
            telefono: '0966666666',
            correo: 'carlos.ruiz@email.com',
            tipoLicencia: 'Tipo B',
            roles: ['conductor', 'controlador']
          }
        ]);
      });
  }, []);

  // Filtrar personal según el rol seleccionado
  const personalFiltrado = personal.filter(p => {
    if (filtroRol === 'todos') return true;
    if (filtroRol === 'conductor') return p.roles?.includes('conductor');
    if (filtroRol === 'controlador') return p.roles?.includes('controlador');
    if (filtroRol === 'ambos') return p.roles?.includes('conductor') && p.roles?.includes('controlador');
    return true;
  });

  const totalPaginas = Math.ceil(personalFiltrado.length / porPagina);
  const personalPagina = personalFiltrado.slice((pagina - 1) * porPagina, pagina * porPagina);

  // Función para mostrar roles
  const mostrarRoles = (roles) => {
    if (!roles || roles.length === 0) return 'Sin rol';
    return roles.join(', ').replace('conductor', 'Conductor').replace('controlador', 'Controlador');
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar a esta persona?')) {
      axios.delete(`${API_URL}/conductores/${id}`)
        .then(() => {
          setPersonal(prev => prev.filter(p => p.id !== id));
        })
        .catch(err => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar el registro');
        });
    }
  };

  return (
    <div className="panel-box">
      <h3>Conductores y Controladores</h3>
      
      {/* Filtros */}
      <div className="filtros-container" style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Filtrar por rol:</label>
        <select 
          value={filtroRol} 
          onChange={(e) => {
            setFiltroRol(e.target.value);
            setPagina(1);
          }}
          style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="todos">Todos</option>
          <option value="conductor">Solo Conductores</option>
          <option value="controlador">Solo Controladores</option>
          <option value="ambos">Ambos Roles</option>
        </select>
      </div>

      <table className="panel-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Identificación</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Licencia</th>
            <th>Roles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personalPagina.length > 0 ? (
            personalPagina.map(p => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.identificacion}</td>
                <td>{p.telefono}</td>
                <td>{p.correo}</td>
                <td>{p.tipoLicencia}</td>
                <td>{mostrarRoles(p.roles)}</td>
                <td>
                  <button className="btn-outline" title="Editar">✏️</button>
                  <button 
                    className="btn-eliminar" 
                    title="Eliminar"
                    onClick={() => handleEliminar(p.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center' }}>
                No hay registros que coincidan con el filtro seleccionado
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      <PaginacionPanel
        paginaActual={pagina}
        totalPaginas={totalPaginas}
        onChange={setPagina}
      />
      
      <div style={{ marginTop: '20px' }}>
        <button className="btn-agregar">Agregar Personal</button>
      </div>
    </div>
  );
};

export default ConductoresPanel;