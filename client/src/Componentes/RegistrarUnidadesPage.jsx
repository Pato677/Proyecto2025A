import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Estilos/RegisterUnits.css';
import Button from './Button';
import UnidadModal from './UnidadModal';
import SimuladorUbicacionModal from './SimularUbicacion';
import { useAuth } from '../Componentes/AuthContext';
import './Estilos/UnidadModal.css';

function RegisterUnitsPage() {
  const [unidades, setUnidades] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [unidadEdit, setUnidadEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const unidadesPorPagina = 8;
  const [mostrarSimulador, setMostrarSimulador] = useState(false);
  const { usuario } = useAuth();

  useEffect(() => {
    if (!usuario?.id) return;

    axios.get(`http://localhost:8000/unidades/cooperativa/${usuario.id}`)
      .then(res => {
        const unidadesArray = res.data.data;
        if (Array.isArray(unidadesArray)) {
          setUnidades(unidadesArray);
          if (unidadesArray.length > 0) {
            setSelectedId(unidadesArray[0].id);
          }
        } else {
          console.error('Respuesta inesperada:', res.data);
          setUnidades([]);
        }
      })
      .catch(error => {
        console.error('Error al cargar unidades:', error);
        setUnidades([]);
      });
  }, [usuario]);

  const totalPaginas = Math.ceil(unidades.length / unidadesPorPagina);
  const startIdx = (currentPage - 1) * unidadesPorPagina;
  const endIdx = startIdx + unidadesPorPagina;
  const unidadesPagina = Array.isArray(unidades) ? unidades.slice(startIdx, endIdx) : [];

  const unidadSeleccionada = unidades.find(u => u.id === selectedId);

  const handleSaveUnidad = (datosUnidad) => {
    const payload = {
      placa: datosUnidad.placa,
      numeroUnidad: datosUnidad.numeroUnidad,
      imagen: datosUnidad.imagen,
      cooperativaId: usuario.id,
      conductorId: datosUnidad.conductor_id,
      controladorId: datosUnidad.controlador_id
    };

    if (modalMode === 'add') {
      axios.post('http://localhost:8000/unidades/cooperativa', payload)
        .then(res => {
          setUnidades(prev => [...prev, res.data]);
          setShowModal(false);
          setSelectedId(res.data.id);
        })
        .catch(error => {
          console.error('Error al guardar unidad:', error.response?.data || error.message);
          alert("Error al guardar unidad: " + (error.response?.data?.error || error.message));
        });
    } else if (modalMode === 'edit' && unidadEdit) {
      axios.put(`http://localhost:8000/unidades/${unidadEdit.id}`, payload)
        .then(res => {
          setUnidades(prev => prev.map(u => u.id === unidadEdit.id ? res.data : u));
          setShowModal(false);
          setUnidadEdit(null);
        })
        .catch(error => {
          console.error('Error al actualizar unidad:', error.response?.data || error.message);
          alert("Error al actualizar unidad: " + (error.response?.data?.error || error.message));
        });
    }
  };

  const handleAgregar = () => {
    setModalMode('add');
    setUnidadEdit(null);
    setShowModal(true);
  };

  const handleActualizar = () => {
    if (!selectedId) return;
    const unidad = unidades.find(u => u.id === selectedId);
    if (unidad) {
      setUnidadEdit({
        id: unidad.id,
        placa: unidad.placa,
        numeroUnidad: unidad.numero_unidad,
        imagen: unidad.imagen_path,
        conductor_id: unidad.conductor_id,
        controlador_id: unidad.controlador_id
      });
      setModalMode('edit');
      setShowModal(true);
    }
  };

  const handleEliminar = () => {
    if (!selectedId) return;
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta unidad?')) return;

    axios.delete(`http://localhost:8000/unidades/${selectedId}`)
      .then(() => {
        setUnidades(prev => prev.filter(u => u.id !== selectedId));
        setSelectedId(null);
      })
      .catch(error => {
        console.error('Error al eliminar unidad:', error.response?.data || error.message);
        alert("Error al eliminar unidad: " + (error.response?.data?.error || error.message));
      });
  };

  const handlePageChange = (num) => {
    setCurrentPage(num);
    const nuevaUnidad = unidades[(num - 1) * unidadesPorPagina];
    if (nuevaUnidad) setSelectedId(nuevaUnidad.id);
  };

  return (
    <div className="register-units-page">
      <main className="register-units-main">
        <h1 className="register-units-title">Registrar Unidades</h1>

        <div className="register-units-container-box">
          <div className="register-units-content">
            <div className="register-units-table-box">
              <table className="register-units-table">
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Nº de unidad</th>
                    <th>Conductor</th>
                    <th>Controlador</th>
                    <th>Ubicación</th>
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
                        <td>{unidad.numero_unidad}</td>
                        <td>{unidad.Conductor?.nombre || 'N/A'}</td>
                        <td>{unidad.Controlador?.nombre || 'N/A'}</td>
                        <td>
                          <button
                            className="ver-ruta-btn"
                            onClick={(e) => { e.stopPropagation(); setMostrarSimulador(true); }}
                          >
                            Ver Ruta
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center' }}>No hay unidades registradas</td>
                    </tr>
                  )}
                </tbody>
              </table>

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
                src={unidadSeleccionada?.imagen_path || "https://via.placeholder.com/400x200?text=Sin+imagen"}
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
        </div>

        <div className="register-units-btn-group">
          <Button text="Atras" width='200px' />
        </div>
      </main>

      <UnidadModal
        open={showModal}
        onClose={() => { setShowModal(false); setUnidadEdit(null); }}
        onSave={handleSaveUnidad}
        initialData={modalMode === 'edit' ? unidadEdit : null}
        mode={modalMode}
      />

      {mostrarSimulador && (
        <SimuladorUbicacionModal onClose={() => setMostrarSimulador(false)} />
      )}
    </div>
  );
}

export default RegisterUnitsPage;
