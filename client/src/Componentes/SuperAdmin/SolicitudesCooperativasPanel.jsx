import React, { useState, useEffect } from 'react';
import PaginacionPanel from './PaginacionPanel';
import '../Estilos/SuperAdminDashboard.css';
import axios from 'axios';

const SolicitudesCooperativasPanel = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);
  const porPagina = 5;

  // Cargar cooperativas desactivadas
  const cargarCooperativasDesactivadas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/usuarios/cooperativas/desactivadas?page=${pagina}&limit=${porPagina}`
      );
      
      if (response.data.success) {
        setSolicitudes(response.data.data);
        setTotalPaginas(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error al cargar cooperativas desactivadas:', error);
      alert('Error al cargar las solicitudes de cooperativas');
    } finally {
      setLoading(false);
    }
  };

  // Activar cooperativa
  const activarCooperativa = async (id) => {
    if (!window.confirm('¿Está seguro de activar esta cooperativa?')) return;
    
    try {
      const response = await axios.patch(
        `http://localhost:8000/usuarios/${id}/estado`,
        { estado: 'activo' }
      );
      
      if (response.data.success) {
        alert('Cooperativa activada exitosamente');
        cargarCooperativasDesactivadas(); // Recargar la lista
      }
    } catch (error) {
      console.error('Error al activar cooperativa:', error);
      alert('Error al activar la cooperativa');
    }
  };

  // Eliminar cooperativa
  const eliminarCooperativa = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta cooperativa? Esta acción no se puede deshacer.')) return;
    
    try {
      const response = await axios.delete(`http://localhost:8000/usuarios/${id}`);
      
      if (response.data.success) {
        alert('Cooperativa eliminada exitosamente');
        cargarCooperativasDesactivadas(); // Recargar la lista
      }
    } catch (error) {
      console.error('Error al eliminar cooperativa:', error);
      alert('Error al eliminar la cooperativa');
    }
  };

  // Cargar datos al montar el componente y cuando cambie la página
  useEffect(() => {
    cargarCooperativasDesactivadas();
  }, [pagina]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="panel-box">
      <h3>📋 Solicitudes de Cooperativas Pendientes</h3>
      {loading ? (
        <div className="loading-container">
          🔄 Cargando solicitudes...
        </div>
      ) : (
        <>
          <table className="panel-table">
            <thead>
              <tr>
                <th>Razón Social</th>
                <th>RUC</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.length > 0 ? (
                solicitudes.map(solicitud => (
                  <tr key={solicitud.id}>
                    <td>{solicitud.UsuarioCooperativa?.razon_social || 'N/A'}</td>
                    <td>{solicitud.UsuarioCooperativa?.ruc || 'N/A'}</td>
                    <td>{solicitud.correo}</td>
                    <td>
                      <span className={`estado-${solicitud.UsuarioCooperativa?.estado || 'desactivo'}`}>
                        {solicitud.UsuarioCooperativa?.estado || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-container">
                        <button 
                          className="btn-outline" 
                          title="Activar cooperativa"
                          onClick={() => activarCooperativa(solicitud.id)}
                        >
                          ✔️ Activar
                        </button>
                        <button 
                          className="btn-eliminar" 
                          title="Eliminar cooperativa"
                          onClick={() => eliminarCooperativa(solicitud.id)}
                        >
                          ❌ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    📋 No hay solicitudes de cooperativas pendientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {totalPaginas > 1 && (
            <PaginacionPanel
              paginaActual={pagina}
              totalPaginas={totalPaginas}
              onChange={setPagina}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SolicitudesCooperativasPanel;