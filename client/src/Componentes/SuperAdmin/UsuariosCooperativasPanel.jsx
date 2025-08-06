import React, { useState, useEffect } from 'react';
import PaginacionPanel from './PaginacionPanel';
import ModalEditarUsuario from './ModalEditarUsuario';
import ModalEditarCooperativa from './ModalEditarCooperativa';
import '../Estilos/SuperAdminDashboard.css';
import axios from 'axios';

const UsuariosCooperativasPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalUsuarioOpen, setModalUsuarioOpen] = useState(false);
  const [modalCooperativaOpen, setModalCooperativaOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [filtroRol, setFiltroRol] = useState('todos');
  const porPagina = 6;

  // Cargar usuarios
  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/usuarios?page=${pagina}&limit=${porPagina}`;
      
      // Agregar filtro por rol si no es "todos"
      if (filtroRol !== 'todos') {
        url += `&rol=${filtroRol}`;
      }

      const response = await axios.get(url);
      
      if (response.data.success) {
        setUsuarios(response.data.data);
        setTotalPaginas(response.data.pagination.totalPages);
        setTotalUsuarios(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (id, tipo) => {
    if (!window.confirm(`¿Está seguro de eliminar este ${tipo.toLowerCase()}? Esta acción no se puede deshacer.`)) return;
    
    try {
      const response = await axios.delete(`http://localhost:8000/usuarios/${id}`);
      
      if (response.data.success) {
        alert(`${tipo} eliminado exitosamente`);
        cargarUsuarios(); // Recargar la lista
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert(`Error al eliminar el ${tipo.toLowerCase()}`);
    }
  };

  // Abrir modal de edición
  const abrirModalEdicion = (usuario) => {
    setUsuarioSeleccionado(usuario);
    if (usuario.rol === 'cooperativa') {
      setModalCooperativaOpen(true);
    } else if (usuario.rol === 'final' || usuario.rol === 'superuser') {
      setModalUsuarioOpen(true);
    }
  };

  // Cerrar modales
  const cerrarModales = () => {
    setModalUsuarioOpen(false);
    setModalCooperativaOpen(false);
    setUsuarioSeleccionado(null);
  };

  // Obtener nombre para mostrar
  const obtenerNombre = (usuario) => {
    if (usuario.rol === 'cooperativa' && usuario.UsuarioCooperativa) {
      return usuario.UsuarioCooperativa.razon_social;
    } else if (usuario.UsuarioFinal) {
      return `${usuario.UsuarioFinal.nombres} ${usuario.UsuarioFinal.apellidos}`;
    }
    return 'N/A';
  };

  // Obtener tipo para mostrar
  const obtenerTipo = (usuario) => {
    if (usuario.rol === 'cooperativa') return 'Cooperativa';
    if (usuario.rol === 'final') return 'Usuario';
    if (usuario.rol === 'superuser') return 'Super Usuario';
    return usuario.rol;
  };

  // Manejar cambio de filtro
  const manejarCambioFiltro = (nuevoFiltro) => {
    setFiltroRol(nuevoFiltro);
    setPagina(1); // Resetear a la primera página cuando se cambia el filtro
  };

  // Cargar datos al montar el componente y cuando cambie la página o filtro
  useEffect(() => {
    cargarUsuarios();
  }, [pagina, filtroRol]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="panel-box">
      <div className="panel-header">
        <h3>👥 Usuarios y Cooperativas</h3>
        
        {/* Filtro por tipo de rol */}
        <div className="filter-section">
          <label htmlFor="filtro-rol">Filtrar por tipo:</label>
          <select
            id="filtro-rol"
            value={filtroRol}
            onChange={(e) => manejarCambioFiltro(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos</option>
            <option value="cooperativa">Cooperativas</option>
            <option value="final">Usuarios</option>
            <option value="superuser">Super Usuarios</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          🔄 Cargando usuarios...
        </div>
      ) : (
        <>
          <table className="panel-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>
                      <span className={`tipo-badge tipo-${usuario.rol}`}>
                        {obtenerTipo(usuario)}
                      </span>
                    </td>
                    <td>{obtenerNombre(usuario)}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.telefono || 'N/A'}</td>
                    <td>
                      {usuario.rol === 'cooperativa' ? (
                        <span className={`estado-${usuario.UsuarioCooperativa?.estado || 'desactivo'}`}>
                          {usuario.UsuarioCooperativa?.estado || 'N/A'}
                        </span>
                      ) : (
                        <span className={`estado-${usuario.UsuarioFinal?.estado || 'activo'}`}>
                          {usuario.UsuarioFinal?.estado || 'Activo'}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="acciones-container">
                        <button 
                          className="btn-outline" 
                          title="Editar usuario"
                          onClick={() => abrirModalEdicion(usuario)}
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          className="btn-eliminar" 
                          title="Eliminar usuario"
                          onClick={() => eliminarUsuario(usuario.id, obtenerTipo(usuario))}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    📋 No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Información de paginación */}
          {usuarios.length > 0 && (
            <div className="pagination-info">
              <span>
                Mostrando {((pagina - 1) * porPagina) + 1} - {Math.min(pagina * porPagina, totalUsuarios)} 
                de {totalUsuarios} usuarios
              </span>
            </div>
          )}
          
          {totalPaginas > 1 && (
            <PaginacionPanel
              paginaActual={pagina}
              totalPaginas={totalPaginas}
              onChange={setPagina}
            />
          )}
        </>
      )}

      {/* Modales */}
      <ModalEditarUsuario
        isOpen={modalUsuarioOpen}
        onClose={cerrarModales}
        usuario={usuarioSeleccionado}
        onSuccess={cargarUsuarios}
      />

      <ModalEditarCooperativa
        isOpen={modalCooperativaOpen}
        onClose={cerrarModales}
        usuario={usuarioSeleccionado}
        onSuccess={cargarUsuarios}
      />
    </div>
  );
};

export default UsuariosCooperativasPanel;