import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import HeaderAdmin from './HeaderAdmin';
import Footer from './Footer';
import './Estilos/RegisterUnits.css';
import Button from './Button';
import UnidadModal from './UnidadModal';

function RegisterUnitsPage() {
  const [unidades, setUnidades] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [unidadEdit, setUnidadEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const unidadesPorPagina = 8;

  // Cargar unidades al inicio
  useEffect(() => {
    axios.get('http://localhost:3000/unidades')
      .then(res => {
        setUnidades(res.data);
        if (res.data.length > 0) {
          setSelectedId(res.data[0].id);
        }
      })
      .catch(() => setUnidades([]));
  }, []);

  // Calcular paginación
  const totalPaginas = Math.ceil(unidades.length / unidadesPorPagina);
  const startIdx = (currentPage - 1) * unidadesPorPagina;
  const endIdx = startIdx + unidadesPorPagina;
  const unidadesPagina = unidades.slice(startIdx, endIdx);

  // Buscar la unidad seleccionada en el array
  const unidadSeleccionada = unidades.find(u => u.id === selectedId);

  // Guardar nueva unidad
  const handleSaveUnidad = (nuevaUnidad) => {
    if (modalMode === 'add') {
      const newId = unidades.length > 0 ? Math.max(...unidades.map(u => Number(u.id))) + 1 : 1;
      const unidadConId = { ...nuevaUnidad, id: newId };
      axios.post('http://localhost:3000/unidades', unidadConId)
        .then(res => {
          setUnidades(prev => [...prev, res.data]);
          setShowModal(false);
          setSelectedId(res.data.id);
        });
    } else if (modalMode === 'edit' && unidadEdit) {
      axios.put(`http://localhost:3000/unidades/${unidadEdit.id}`, { ...nuevaUnidad, id: unidadEdit.id })
        .then(res => {
          setUnidades(prev => prev.map(u => u.id === unidadEdit.id ? res.data : u));
          setShowModal(false);
          setSelectedId(unidadEdit.id);
          setUnidadEdit(null);
        });
    }
  };

  // Abrir modal para agregar
  const handleAgregar = () => {
    setModalMode('add');
    setUnidadEdit(null);
    setShowModal(true);
  };

  // Abrir modal para editar y cargar datos
  const handleActualizar = () => {
    if (!selectedId) return;
    axios.get(`http://localhost:3000/unidades/${selectedId}`)
      .then(res => {
        setUnidadEdit(res.data);
        setModalMode('edit');
        setShowModal(true);
      });
  };

  // Eliminar unidad seleccionada
  const handleEliminar = () => {
    if (!selectedId) return;
    axios.delete(`http://localhost:3000/unidades/${selectedId}`)
      .then(() => {
        setUnidades(prev => prev.filter(u => u.id !== selectedId));
        setTimeout(() => {
          setSelectedId(prev => {
            const restantes = unidades.filter(u => u.id !== selectedId);
            return restantes.length > 0 ? restantes[0].id : null;
          });
        }, 0);
      });
  };

  // Cambiar página
  const handlePageChange = (num) => {
    setCurrentPage(num);
    // Seleccionar el primer elemento de la nueva página si existe
    const nuevaUnidad = unidades[(num - 1) * unidadesPorPagina];
    if (nuevaUnidad) setSelectedId(nuevaUnidad.id);
  };

  return (
    <div className="register-units-page">
      <HeaderAdmin />

      <main className="register-units-main">
        <h1 className="register-units-title">Registrar Unidades</h1>
        <div className="register-units-content">
          <div className="register-units-table-box">
            <table className="register-units-table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>N° de unidad</th>
                  <th>Conductor</th>
                  <th>Controlador</th>
                  <th>N° de pisos</th>
                  <th>Nro de asientos</th>
                </tr>
              </thead>
              <tbody>
                {unidadesPagina.length > 0 ? (
                  unidadesPagina.map((unidad) => (
                    <tr
                      key={unidad.id}
                      className={selectedId === unidad.id ? 'selected-row' : ''}
                      onClick={() => setSelectedId(unidad.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{unidad.placa}</td>
                      <td>{unidad.numeroUnidad}</td>
                      <td>{unidad.conductor}</td>
                      <td>{unidad.controlador}</td>
                      <td>{unidad.pisos}</td>
                      <td>{unidad.asientos}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>No hay unidades registradas</td>
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
          <div className="register-units-image-box">
            <img
              src={unidadSeleccionada?.imagen || "https://via.placeholder.com/400x200?text=Sin+imagen"}
              alt="Bus"
              className="register-units-image"
            />
          </div>
        </div>

        <div className="register-units-btn-group">
          <button className="register-units-btn" onClick={handleAgregar}>Agregar</button>
          <button className="register-units-btn" onClick={handleEliminar}>Eliminar</button>
          <button className="register-units-btn" onClick={handleActualizar}>Actualizar</button>
        </div>

        <div className="register-units-btn-group">
          <Button text="Atras" width='200px'/>
          <Button text="Ver Ubicacion" width='200px'/>
        </div>
      </main>

      <Footer />

      <UnidadModal
        open={showModal}
        onClose={() => { setShowModal(false); setUnidadEdit(null); }}
        onSave={handleSaveUnidad}
        initialData={modalMode === 'edit' ? unidadEdit : null}
        mode={modalMode}
      />
    </div>
  );
}

export default RegisterUnitsPage;