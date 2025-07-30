import React, { useEffect, useState, useCallback } from 'react';
import RoutesTable from './RoutesTable';
import ActionButtons from './ActionButtons';
import ParadasModal from './ParadasModal';
import RutaModal from './RutasModal';
import RutaForm from './RutaForm';
import './Estilos/RutasPanel.css';
import axios from 'axios';

const rutasPorPagina = 4;
// URL de la API del backend
const API_URL_Rutas = "http://localhost:8000/rutas";
const API_URL_Terminales = "http://localhost:8000/terminales";

const RutasPanel = ({ cooperativaId = 1 }) => { // Por defecto cooperativa 1 para pruebas
  const [rutas, setRutas] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [rutaEdit, setRutaEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showParadas, setShowParadas] = useState(false);
  const [showRutaForm, setShowRutaForm] = useState(false);
  const [terminales, setTerminales] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooperativas, setCooperativas] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: rutasPorPagina
  });

  // 🔄 Recargar rutas desde el servidor con paginación por cooperativa
  const recargarRutas = useCallback(async (page = currentPage) => {
    setLoading(true);
    try {
      // Usar endpoint por cooperativa
      const response = await axios.get(`${API_URL_Rutas}/cooperativa/${cooperativaId}?page=${page}&limit=${rutasPorPagina}`);
      if (response.data.success) {
        setRutas(response.data.data);
        setPagination(response.data.pagination);
        console.log(`Rutas cargadas para cooperativa ${cooperativaId}: ${response.data.data.length} de ${response.data.pagination.totalItems}`);
      } else {
        setRutas([]);
        console.error('Error en la respuesta:', response.data.message);
      }
    } catch (error) {
      console.error('Error al cargar rutas:', error);
      setRutas([]);
      // Mostrar datos de ejemplo si falla la conexión
      setRutas([
        {
          id: 1,
          numeroRuta: "R-001",
          ciudadOrigen: "Quito",
          terminalOrigen: "Terminal Terrestre Quitumbe",
          ciudadDestino: "Guayaquil",
          terminalDestino: "Terminal Terrestre",
          horaSalida: "08:00",
          horaLlegada: "16:00",
          paradas: ["Santo Domingo", "Quevedo", "Babahoyo"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // Cargar rutas y terminales al inicio
  useEffect(() => {
    recargarRutas();

    axios.get('http://localhost:8000/ciudades-terminales')
      .then(res => {
        if (res.data.success) {
          // Transformar los datos a la estructura esperada 
          const terminalData = res.data.data.flatMap(ciudad => 
            ciudad.terminales.map(terminal => ({
              id: terminal.id,
              ciudad: ciudad.nombre,
              terminal: terminal.nombre,
              direccion: terminal.direccion
            }))
          );
          setTerminales(terminalData);
        }
      })
      .catch(() => setTerminales([]));
  }, []);

  // Cargar cooperativas disponibles
  const cargarCooperativas = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/cooperativas');
      console.log('Cooperativas cargadas:', response.data);
      if (response.data.success) {
        setCooperativas(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar cooperativas:', error);
      setCooperativas([]);
    }
  }, []);

  // Cargar rutas, terminales y cooperativas al inicio
  useEffect(() => {
    recargarRutas(1);
    cargarTerminales();
    cargarCooperativas();
  }, [cooperativaId]); // Recargar cuando cambie la cooperativa

  // Guardar nueva ruta o editar ruta existente
  const handleSaveRuta = async (nuevaRuta) => {
    setLoading(true);
    try {
      if (modalMode === 'add') {
        console.log('Creando nueva ruta:', nuevaRuta);
        
        // Mapear datos del formulario al formato del backend
        const rutaData = {
          numeroRuta: nuevaRuta.numeroRuta,
          terminalOrigenId: nuevaRuta.terminalOrigenId,
          terminalDestinoId: nuevaRuta.terminalDestinoId,
          horaSalida: nuevaRuta.horaSalida,
          horaLlegada: nuevaRuta.horaLlegada,
          cooperativaId: cooperativaId // Usar el ID de la cooperativa actual
        };

        const response = await axios.post(API_URL_Rutas, rutaData);
        if (response.data.success) {
          console.log('Ruta creada exitosamente:', response.data.data);
          await recargarRutas(currentPage);
          setShowModal(false);
          alert('Ruta creada exitosamente');
        } else {
          throw new Error(response.data.message);
        }
      } else if (modalMode === 'edit' && rutaEdit) {
        console.log('Actualizando ruta:', rutaEdit.id, nuevaRuta);
        
        const rutaData = {
          numeroRuta: nuevaRuta.numeroRuta,
          terminalOrigenId: nuevaRuta.terminalOrigenId,
          terminalDestinoId: nuevaRuta.terminalDestinoId,
          horaSalida: nuevaRuta.horaSalida,
          horaLlegada: nuevaRuta.horaLlegada,
          paradas: Array.isArray(nuevaRuta.paradas) ? nuevaRuta.paradas : nuevaRuta.paradas.split(',').map(p => p.trim())
        };

        const response = await axios.put(`${API_URL_Rutas}/${rutaEdit.id}`, rutaData);
        if (response.data.success) {
          console.log('Ruta actualizada exitosamente:', response.data.data);
          await recargarRutas(currentPage);
          setShowModal(false);
          setRutaEdit(null);
          alert('Ruta actualizada exitosamente');
        } else {
          throw new Error(response.data.message);
        }
      }
    } catch (error) {
      console.error('Error al guardar ruta:', error);
      alert(`Error al guardar la ruta: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para agregar
  const handleAgregar = () => {
    setModalMode('add');
    setRutaEdit(null);
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleActualizar = () => {
    if (!selectedId) {
      alert('Por favor selecciona una ruta para actualizar');
      return;
    }
    const ruta = rutas.find(r => r.id === selectedId);
    if (!ruta) {
      alert('Ruta no encontrada');
      return;
    }
    setRutaEdit(ruta);
    setModalMode('edit');
    setShowModal(true);
  };

  // Abrir RutaForm (Leaflet) para editar paradas
  const handleEditRoute = (ruta) => {
    console.log('Editando paradas de ruta:', ruta);
    setRutaEdit(ruta);
    setModalMode('edit');
    setShowRutaForm(true);
  };

  // Abrir ParadasModal para ver paradas
  const handleViewRoute = async (ruta) => {
    console.log('Viendo ruta:', ruta);
    try {
      setLoading(true);
      // Obtener la ruta actualizada del servidor
      const response = await axios.get(`${API_URL_Rutas}/${ruta.id}`);
      if (response.data.success) {
        setRutaSeleccionada(response.data.data);
        setShowParadas(true);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error al cargar la ruta:', error);
      // Usar datos locales si falla la conexión
      setRutaSeleccionada(ruta);
      setShowParadas(true);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar ruta
  const handleEliminar = async () => {
    if (!selectedId) {
      alert('Por favor selecciona una ruta para eliminar');
      return;
    }
    
    const ruta = rutas.find(r => r.id === selectedId);
    if (!ruta) {
      alert('Ruta no encontrada');
      return;
    }

    if (!window.confirm(`¿Estás seguro de que deseas eliminar la ruta ${ruta.numeroRuta}?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`${API_URL_Rutas}/${ruta.id}`);
      if (response.data.success) {
        console.log('Ruta eliminada exitosamente');
        await recargarRutas(currentPage);
        setSelectedId(null);
        alert('Ruta eliminada exitosamente');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error al eliminar ruta:', error);
      alert(`Error al eliminar la ruta: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar página
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setCurrentPage(newPage);
    recargarRutas(newPage);
    setSelectedId(null);
  };

  // Actualizar paradas desde RutaForm
  const handleRutaActualizada = () => {
    console.log('Ruta actualizada, recargando...');
    recargarRutas(currentPage);
    setShowRutaForm(false);
    setRutaEdit(null);
  };

  return (
    <div className="rutas-panel-container">
      <main className="rutas-panel-main">
        <section className="rutas-panel">
          <h1 className="rutas-title">Gestión de Rutas</h1>
          
          {loading && (
            <div className="loading-indicator">
              <p>Cargando...</p>
            </div>
          )}
          
          <div className="rutas-content">
            <div className="rutas-table-wrapper">
              <RoutesTable
                rutas={rutas}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onViewRoute={handleViewRoute}
                onEditRoute={handleEditRoute}
                loading={loading}
              />

              {/* Información de paginación */}
              <div className="pagination-info">
                <span>
                  Mostrando {rutas.length} de {pagination.totalItems} rutas 
                  (Página {pagination.currentPage} de {pagination.totalPages})
                </span>
              </div>

              {/* Paginación */}
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1 || loading}
                >
                  &lt;
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={currentPage === i + 1 ? 'active' : ''}
                    onClick={() => handlePageChange(i + 1)}
                    disabled={loading}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === pagination.totalPages || loading}
                >
                  &gt;
                </button>
              </div>
            </div>

            <ActionButtons
              onAdd={handleAgregar}
              onDelete={handleEliminar}
              onUpdate={handleActualizar}
              disabled={loading}
            />
          </div>

          {/* Modal para ver paradas */}
          {showParadas && rutaSeleccionada && (
            <ParadasModal
              onClose={() => setShowParadas(false)}
              ruta={rutaSeleccionada}
            />
          )}

          {/* Modal con Leaflet para editar paradas */}
          {showRutaForm && rutaEdit && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button
                  className="modal-close-button"
                  onClick={() => setShowRutaForm(false)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    zIndex: 1001
                  }}
                >
                  ×
                </button>
                <RutaForm
                  ruta={rutaEdit}
                  onClose={() => setShowRutaForm(false)}
                  onRutaActualizada={handleRutaActualizada}
                />
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Modal para crear/editar ruta (información básica) */}
      <RutaModal
        open={showModal}
        onClose={() => { 
          setShowModal(false); 
          setRutaEdit(null); 
        }}
        onSave={handleSaveRuta}
        initialData={modalMode === 'edit' ? rutaEdit : null}
        mode={modalMode}
        terminales={terminales}
        loading={loading}
      />
    </div>
  );
};

export default RutasPanel;