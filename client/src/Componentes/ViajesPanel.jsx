import React, { useEffect, useState } from 'react';
import ViajesTable from './ViajesTable';
import ActionButtons from './ActionButtons';
import ViajeModal from './ViajeModal';
import './Estilos/ViajesPanel.css';
import axios from 'axios';

const viajesPorPagina = 4;
// Ruta de la API
const API_URL_Viajes = "http://localhost:3000/viajes";

const ViajesPanel = () => {
  const [viajes, setViajes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [viajeEdit, setViajeEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rutas, setRutas] = useState([]);
  const [unidades, setUnidades] = useState([]);

  // 🔄 Recargar viajes desde el servidor
  const recargarViajes = () => {
    axios.get(API_URL_Viajes)
      .then(res => setViajes(res.data))
      .catch(() => setViajes([]));
  };

  // Cargar viajes, rutas y unidades al inicio
  useEffect(() => {
    recargarViajes();

    axios.get('http://localhost:3000/Rutas')
      .then(res => setRutas(res.data))
      .catch(() => setRutas([]));

    axios.get('http://localhost:3000/unidades')
      .then(res => setUnidades(res.data))
      .catch(() => setUnidades([]));
  }, []);

  const totalPaginas = Math.ceil(viajes.length / viajesPorPagina);
  const startIdx = (currentPage - 1) * viajesPorPagina;
  const endIdx = startIdx + viajesPorPagina;
  const viajesPagina = viajes.slice(startIdx, endIdx);

  // Guardar nuevo o editar viaje desde ViajeModal
  const handleSaveViaje = (nuevoViaje) => {
    if (modalMode === 'add') {
      axios.post(API_URL_Viajes, nuevoViaje)
        .then(res => {
          recargarViajes();
          setShowModal(false);
        })
        .catch(error => {
          console.error('Error al crear viaje:', error);
          alert("Error al crear el viaje");
        });
    } else if (modalMode === 'edit' && viajeEdit) {
      const id = viajeEdit.id;
      axios.put(`${API_URL_Viajes}/${id}`, { ...nuevoViaje, id })
        .then(res => {
          recargarViajes();
          setShowModal(false);
          setViajeEdit(null);
        })
        .catch(() => {
          alert("Error al actualizar el viaje. Verifica que el ID exista.");
        });
    }
  };

  // Abrir modal para agregar
  const handleAgregar = () => {
    console.log('Abriendo modal para agregar');
    setModalMode('add');
    setViajeEdit(null);
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleActualizar = () => {
    if (!selectedId) {
      console.log('No hay ID seleccionado');
      return;
    }
    const viaje = viajes.find(v => v.id === selectedId);
    if (!viaje) {
      console.log('No se encontró el viaje');
      return;
    }
    console.log('Abriendo modal para editar viaje:', viaje);
    setViajeEdit(viaje);
    setModalMode('edit');
    setShowModal(true);
  };

  // Eliminar viaje
  const handleEliminar = () => {
    if (!selectedId) return;
    const viaje = viajes.find(v => v.id === selectedId);
    if (!viaje) return;
    axios.delete(`${API_URL_Viajes}/${viaje.id}`)
      .then(() => {
        setViajes(prev => prev.filter(v => v.id !== viaje.id));
        setSelectedId(null);
      })
      .catch(() => {
        alert("Error al eliminar el viaje");
      });
  };

  const handlePageChange = (num) => {
    setCurrentPage(num);
    setSelectedId(null);
  };

  return (
    <div className="viajes-panel-container">
      <main className="viajes-panel-main">
        <section className="viajes-panel">
          <h1 className="viajes-title">Viajes</h1>
          <div className="viajes-content">
            <div className="viajes-table-wrapper">
              <ViajesTable
                viajes={viajesPagina}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
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
        </section>
      </main>

      {/* Modal para crear/editar viaje */}
      {console.log('Estado del modal - showModal:', showModal, 'modalMode:', modalMode)}
      <ViajeModal
        open={showModal}
        onClose={() => { setShowModal(false); setViajeEdit(null); }}
        onSave={handleSaveViaje}
        initialData={modalMode === 'edit' ? viajeEdit : null}
        mode={modalMode}
        rutas={rutas}
        unidades={unidades}
      />
    </div>
  );
};

export default ViajesPanel;
