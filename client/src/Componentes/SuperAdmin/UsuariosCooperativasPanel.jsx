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
  const porPagina = 6;

  // Cargar usuarios
  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/usuarios?page=${pagina}&limit=${porPagina}`
      );
      
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

  // Cargar datos al montar el componente y cuando cambie la página
  useEffect(() => {
    cargarUsuarios();
  }, [pagina]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="panel-box">
      <h3>👥 Usuarios y Cooperativas</h3>
      
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