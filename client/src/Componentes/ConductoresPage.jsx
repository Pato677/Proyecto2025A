import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Estilos/ConductoresPage.css';
import Button from './Button';
import ConductorModal from './ConductorModal';

function ConductoresPage() {
  const [conductores, setConductores] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [conductorEdit, setConductorEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const conductoresPorPagina = 8;

  // URL base consistente
  const API_URL = 'http://localhost:8000';

  // Cargar conductores al inicio
  useEffect(() => {
    axios.get(`${API_URL}/conductores`)
      .then(res => {
        setConductores(res.data);
        if (res.data.length > 0) {
          setSelectedId(res.data[0].id);
        }
      })
      .catch(err => {
        console.error('Error al cargar conductores:', err);
        setConductores([]);
      });
  }, []);

  // Calcular paginación
  const totalPaginas = Math.ceil(conductores.length / conductoresPorPagina);
  const startIdx = (currentPage - 1) * conductoresPorPagina;
  const endIdx = startIdx + conductoresPorPagina;
  const conductoresPagina = conductores.slice(startIdx, endIdx);

  // Buscar el conductor seleccionado
  const conductorSeleccionado = conductores.find(c => c.id === selectedId);

  // Guardar nuevo conductor
  const handleSaveConductor = (nuevoConductor) => {
    if (modalMode === 'add') {
      const newId = conductores.length > 0 ? Math.max(...conductores.map(c => Number(c.id))) + 1 : 1;
      const conductorConId = { ...nuevoConductor, id: newId };
      axios.post(`${API_URL}/conductores`, conductorConId)
        .then(res => {
          setConductores(prev => [...prev, res.data]);
          setShowModal(false);
          setSelectedId(res.data.id);
        })
        .catch(err => console.error('Error al agregar conductor:', err));
    } else if (modalMode === 'edit' && conductorEdit) {
      axios.put(`${API_URL}/conductores/${conductorEdit.id}`, { ...nuevoConductor, id: conductorEdit.id })
        .then(res => {
          setConductores(prev => prev.map(c => c.id === conductorEdit.id ? res.data : c));
          setShowModal(false);
          setSelectedId(conductorEdit.id);
          setConductorEdit(null);
        })
        .catch(err => console.error('Error al actualizar conductor:', err));
    }
  };

  // Abrir modal para agregar
  const handleAgregar = () => {
    setModalMode('add');
    setConductorEdit(null);
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleActualizar = () => {
    if (!selectedId) return;
    
    // Buscar el conductor en el estado local primero
    const conductorLocal = conductores.find(c => c.id === selectedId);
    if (conductorLocal) {
      setConductorEdit(conductorLocal);
      setModalMode('edit');
      setShowModal(true);
    } else {
      // Si no está en el estado local, hacer petición al servidor
      axios.get(`${API_URL}/conductores/${selectedId}`)
        .then(res => {
          setConductorEdit(res.data);
          setModalMode('edit');
          setShowModal(true);
        })
        .catch(err => {
          console.error('Error al cargar conductor:', err);
          alert('Error al cargar los datos del conductor');
        });
    }
  };

  // Eliminar conductor seleccionado
  const handleEliminar = () => {
    if (!selectedId) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este conductor?')) {
      axios.delete(`${API_URL}/conductores/${selectedId}`)
        .then(() => {
          setConductores(prev => prev.filter(c => c.id !== selectedId));
          // Seleccionar el siguiente conductor disponible
          const restantes = conductores.filter(c => c.id !== selectedId);
          setSelectedId(restantes.length > 0 ? restantes[0].id : null);
        })
        .catch(err => {
          console.error('Error al eliminar conductor:', err);
          alert('Error al eliminar el conductor');
        });
    }
  };

  // Cambiar página
  const handlePageChange = (num) => {
    setCurrentPage(num);
    const nuevoConductor = conductores[(num - 1) * conductoresPorPagina];
    if (nuevoConductor) setSelectedId(nuevoConductor.id);
  };

  return (
    <div className="conductores-page">
      <main className="conductores-main">
        <h1 className="conductores-title">Gestión de Conductores</h1>
        <div className="conductores-content">
          <div className="conductores-table-box">
            <table className="conductores-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Identificación</th>
                  <th>Tipo Licencia</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                </tr>
              </thead>
              <tbody>
                {conductoresPagina.length > 0 ? (
                  conductoresPagina.map((conductor) => (
                    <tr
                      key={conductor.id}
                      className={selectedId === conductor.id ? 'selected-row' : ''}
                      onClick={() => setSelectedId(conductor.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{conductor.nombre}</td>
                      <td>{conductor.identificacion}</td>
                      <td>{conductor.tipoLicencia}</td>
                      <td>{conductor.telefono}</td>
                      <td>{conductor.correo}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center' }}>No hay conductores registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <button
                    key={i + 1}
                    className={currentPage === i + 1 ? 'active' : ''}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPaginas}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
          
          <div className="conductores-info-box">
            <div className="conductor-avatar">
              <div className="avatar-circle">
                <span className="avatar-initials">
                  {conductorSeleccionado ? 
                    conductorSeleccionado.nombre.split(' ').map(n => n[0]).join('').toUpperCase() 
                    : '?'}
                </span>
              </div>
            </div>
            <div className="conductor-details">
              <h3>{conductorSeleccionado?.nombre || 'Selecciona un conductor'}</h3>
              <p><strong>ID:</strong> {conductorSeleccionado?.identificacion || 'N/A'}</p>
              <p><strong>Licencia:</strong> {conductorSeleccionado?.tipoLicencia || 'N/A'}</p>
              <p><strong>Teléfono:</strong> {conductorSeleccionado?.telefono || 'N/A'}</p>
              <p><strong>Correo:</strong> {conductorSeleccionado?.correo || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="conductores-btn-group">
          <button className="conductores-btn" onClick={handleAgregar}>Agregar</button>
          <button 
            className="conductores-btn" 
            onClick={handleEliminar}
            disabled={!selectedId}
          >
            Eliminar
          </button>
          <button 
            className="conductores-btn" 
            onClick={handleActualizar}
            disabled={!selectedId}
          >
            Actualizar
          </button>
        </div>

        <div className="conductores-btn-group">
          <Button text="Atrás" width='200px'/>
        </div>
      </main>

      <ConductorModal
        open={showModal}
        onClose={() => { setShowModal(false); setConductorEdit(null); }}
        onSave={handleSaveConductor}
        initialData={modalMode === 'edit' ? conductorEdit : null}
        mode={modalMode}
      />
    </div>
  );
}

export default ConductoresPage;