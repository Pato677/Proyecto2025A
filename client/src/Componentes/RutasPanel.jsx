import React, { useEffect, useState } from 'react';
import HeaderAdmin from './HeaderAdmin';
import RoutesTable from './RoutesTable';
import ActionButtons from './ActionButtons';
import ParadasModal from './ParadasModal';
import RutaModal from './RutasModal';
import RutaForm from './RutaForm';
import Footer from './Footer';
import './Estilos/RutasPanel.css';
import './Estilos/Footer.css';
import axios from 'axios';

const rutasPorPagina = 4;
// Ruta de la API
const API_URL_Rutas = "http://localhost:3000/rutas";

const RutasPanel = () => {
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

  // 🔄 Recargar rutas desde el servidor
  const recargarRutas = () => {
    axios.get(API_URL_Rutas)
      .then(res => setRutas(res.data))
      .catch(() => setRutas([]));
  };

  // Cargar rutas y terminales al inicio
  useEffect(() => {
    recargarRutas();

    axios.get('http://localhost:3000/terminales')
      .then(res => setTerminales(res.data))
      .catch(() => setTerminales([]));
  }, []);

  const totalPaginas = Math.ceil(rutas.length / rutasPorPagina);
  const startIdx = (currentPage - 1) * rutasPorPagina;
  const endIdx = startIdx + rutasPorPagina;
  const rutasPagina = rutas.slice(startIdx, endIdx);

  // Guardar nueva o editar ruta desde RutaModal
  const handleSaveRuta = (nuevaRuta) => {
    if (modalMode === 'add') {
      const newId = rutas.length > 0 ? Math.max(...rutas.map(r => Number(r.id || 0))) + 1 : 1;
      const rutaConId = { ...nuevaRuta, id: newId };
      axios.post(API_URL_Rutas, rutaConId)
        .then(res => {
          setRutas(prev => [...prev, res.data]);
          setShowModal(false);
        });
    } else if (modalMode === 'edit' && rutaEdit) {
      const id = rutaEdit.id;
      axios.put(`${API_URL_Rutas}/${id}`, { ...nuevaRuta, id })
        .then(res => {
          setRutas(prev => prev.map(r => r.id === id ? res.data : r));
          setShowModal(false);
          setRutaEdit(null);
        })
        .catch(() => {
          alert("Error al actualizar la ruta. Verifica que el ID exista.");
        });
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
    if (!selectedId) return;
    const ruta = rutas.find(r => r.id === selectedId);
    if (!ruta) return;
    setRutaEdit(ruta);
    setModalMode('edit');
    setShowModal(true);
  };

  // Abrir RutaForm (Leaflet) para editar paradas
  const handleEditRoute = (ruta) => {
    setRutaEdit(ruta);
    setModalMode('edit');
    setShowRutaForm(true);
  };

  // Abrir ParadasModal con ruta actualizada desde el servidor
  const handleViewRoute = (ruta) => {
    // 🔄 Refrescar ruta antes de mostrar
    axios.get(`${API_URL_Rutas}/${ruta.id}`)
      .then(res => {
        setRutaSeleccionada(res.data);
        setShowParadas(true);
      })
      .catch(() => {
        alert("❌ No se pudo cargar la ruta actualizada.");
      });
  };

  // Eliminar ruta
  const handleEliminar = () => {
    if (!selectedId) return;
    const ruta = rutas.find(r => r.id === selectedId);
    if (!ruta) return;
    axios.delete(`${API_URL_Rutas}/${ruta.id}`)
      .then(() => {
        setRutas(prev => prev.filter(r => r.id !== ruta.id));
        setSelectedId(null);
      });
  };

  const handlePageChange = (num) => {
    setCurrentPage(num);
    setSelectedId(null);
  };

  return (
    <div className="rutas-panel-container">
      <HeaderAdmin />
      <main className="rutas-panel-main">
        <section className="rutas-panel">
          <h1 className="rutas-title">Rutas</h1>
          <div className="rutas-content">
            <div className="rutas-table-wrapper">
              <RoutesTable
                rutas={rutasPagina}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onViewRoute={handleViewRoute}
                onEditRoute={handleEditRoute}
              />

              {/* Paginación */}
              <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <button
                    key={i + 1}
                    className={currentPage === i + 1 ? 'active' : ''}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPaginas}>&gt;</button>
              </div>
            </div>

            <ActionButtons
              onAdd={handleAgregar}
              onDelete={handleEliminar}
              onUpdate={handleActualizar}
            />
          </div>

          {/* Modal para ver paradas */}
          {showParadas && (
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
                  onRutaActualizada={recargarRutas}
                />
              </div>
            </div>
          )}
        </section>
      </main>
      <footer>
        <Footer />
      </footer>

      {/* Modal para crear/editar ruta (sin mapa) */}
      <RutaModal
        open={showModal}
        onClose={() => { setShowModal(false); setRutaEdit(null); }}
        onSave={handleSaveRuta}
        initialData={modalMode === 'edit' ? rutaEdit : null}
        mode={modalMode}
        terminales={terminales}
      />
    </div>
  );
};

export default RutasPanel;