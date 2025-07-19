import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderAdmin from './HeaderAdmin';
import Footer from './Footer';
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

  // Cargar conductores al inicio
  useEffect(() => {
    axios.get('http://localhost:8000/conductores')
      .then(res => {
        setConductores(res.data);
        if (res.data.length > 0) {
          setSelectedId(res.data[0].id);
        }
      })
      .catch(() => setConductores([]));
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
      axios.post('http://localhost:8000/conductores', conductorConId)
        .then(res => {
          setConductores(prev => [...prev, res.data]);
          setShowModal(false);
          setSelectedId(res.data.id);
        });
    } else if (modalMode === 'edit' && conductorEdit) {
      axios.put(`http://localhost:8000/conductores/${conductorEdit.id}`, { ...nuevoConductor, id: conductorEdit.id })
        .then(res => {
          setConductores(prev => prev.map(c => c.id === conductorEdit.id ? res.data : c));
          setShowModal(false);
          setSelectedId(conductorEdit.id);
          setConductorEdit(null);
        });
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
    axios.get(`http://localhost:8000/conductores/${selectedId}`)
      .then(res => {
        setConductorEdit(res.data);
        setModalMode('edit');
        setShowModal(true);
      });
  };

  // Eliminar conductor seleccionado
  const handleEliminar = () => {
    if (!selectedId) return;
    axios.delete(`http://localhost:8000/conductores/${selectedId}`)
      .then(() => {
        setConductores(prev => prev.filter(c => c.id !== selectedId));
        setTimeout(() => {
          setSelectedId(prev => {
            const restantes = conductores.filter(c => c.id !== selectedId);
            return restantes.length > 0 ? restantes[0].id : null;
          });
        }, 0);
      });
  };

  // Cambiar página
  const handlePageChange = (num) => {
    setCurrentPage(num);
    const nuevoConductor = conductores[(num - 1) * conductoresPorPagina];
    if (nuevoConductor) setSelectedId(nuevoConductor.id);
  };

  return (
    <div className="conductores-page">
      <HeaderAdmin />

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
          <button className="conductores-btn" onClick={handleEliminar}>Eliminar</button>
          <button className="conductores-btn" onClick={handleActualizar}>Actualizar</button>
        </div>

        <div className="conductores-btn-group">
          <Button text="Atrás" width='200px'/>
          <Button text="Exportar Lista" width='200px'/>
        </div>
      </main>

      <Footer />

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