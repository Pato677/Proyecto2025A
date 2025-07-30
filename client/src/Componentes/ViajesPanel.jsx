import React, { useEffect, useState } from 'react';
import ViajesTable from './ViajesTable';
import ActionButtons from './ActionButtons';
import ViajeModal from './ViajeModal';
import ViajeUpdateModal from './ViajeUpdateModal';
import './Estilos/ViajesPanel.css';
import axios from 'axios';

const viajesPorPagina = 4;
// Rutas de la API
const API_URL_Viajes = "http://localhost:8000/viajes/cooperativa/1";
const API_URL_Viajes_CRUD = "http://localhost:8000/viajes"; // Para crear, actualizar y eliminar
const COOPERATIVA_ID = 1; // ID de la cooperativa para pruebas

const ViajesPanel = () => {
  const [viajes, setViajes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [viajeEdit, setViajeEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rutas, setRutas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [asientosOcupados, setAsientosOcupados] = useState({});

  // 🔄 Recargar viajes desde el servidor
  const recargarViajes = () => {
    axios.get(API_URL_Viajes)
      .then(res => {
        console.log('Respuesta completa del servidor:', res.data);
        // El controlador devuelve los viajes en res.data.data
        if (res.data.success && res.data.data) {
          setViajes(res.data.data);
          console.log('Viajes cargados:', res.data.data.length);
          // Cargar asientos ocupados para cada viaje
          cargarAsientosOcupados(res.data.data);
        } else {
          console.log('No hay viajes o respuesta sin éxito');
          setViajes([]);
          setAsientosOcupados({});
        }
      })
      .catch(error => {
        console.error('Error al cargar viajes:', error);
        setViajes([]);
        setAsientosOcupados({});
      });
  };

  // 🪑 Cargar asientos ocupados para todos los viajes
  const cargarAsientosOcupados = async (viajesData) => {
    const asientosPromises = viajesData.map(viaje => 
      axios.get(`${API_URL_Viajes_CRUD}/${viaje.id}/asientos-ocupados`)
        .then(res => ({
          viajeId: viaje.id,
          totalAsientosOcupados: res.data.success ? res.data.data.totalAsientosOcupados : 0
        }))
        .catch(error => {
          console.error(`Error al cargar asientos ocupados para viaje ${viaje.id}:`, error);
          return {
            viajeId: viaje.id,
            totalAsientosOcupados: 0
          };
        })
    );

    try {
      const resultados = await Promise.all(asientosPromises);
      const asientosMap = {};
      resultados.forEach(resultado => {
        asientosMap[resultado.viajeId] = resultado.totalAsientosOcupados;
      });
      setAsientosOcupados(asientosMap);
      console.log('Asientos ocupados cargados:', asientosMap);
    } catch (error) {
      console.error('Error al cargar todos los asientos ocupados:', error);
      setAsientosOcupados({});
    }
  };

  // Cargar viajes, rutas y unidades al inicio
  useEffect(() => {
    recargarViajes();

    // Cargar rutas específicas de la cooperativa
    axios.get(`http://localhost:8000/rutas/cooperativa/${COOPERATIVA_ID}`)
      .then(res => {
        console.log('Respuesta de rutas por cooperativa:', res.data);
        if (res.data.success && res.data.data) {
          setRutas(res.data.data);
          console.log(`Rutas cargadas para cooperativa ${COOPERATIVA_ID}:`, res.data.data.length);
        } else {
          console.log('No hay rutas para esta cooperativa');
          setRutas([]);
        }
      })
      .catch(error => {
        console.error('Error al cargar rutas de la cooperativa:', error);
        setRutas([]);
      });

    // Cargar unidades específicas de la cooperativa
    axios.get(`http://localhost:8000/unidades/cooperativa/${COOPERATIVA_ID}`)
      .then(res => {
        console.log('Respuesta de unidades por cooperativa:', res.data);
        if (res.data.success && res.data.data) {
          setUnidades(res.data.data);
          console.log(`Unidades cargadas para cooperativa ${COOPERATIVA_ID}:`, res.data.data.length);
        } else {
          console.log('No hay unidades para esta cooperativa');
          setUnidades([]);
        }
      })
      .catch(error => {
        console.error('Error al cargar unidades de la cooperativa:', error);
        setUnidades([]);
      });
  }, [recargarViajes]);

  const totalPaginas = Math.ceil(viajes.length / viajesPorPagina);
  const startIdx = (currentPage - 1) * viajesPorPagina;
  const endIdx = startIdx + viajesPorPagina;
  // Agregar información de asientos ocupados a los viajes de la página actual
  const viajesPagina = viajes.slice(startIdx, endIdx).map(viaje => ({
    ...viaje,
    asientos_ocupados_reales: asientosOcupados[viaje.id] || 0
  }));

  // Crear nuevo viaje
  const handleSaveViaje = (nuevoViaje) => {
    axios.post(API_URL_Viajes_CRUD, nuevoViaje)
      .then(res => {
        console.log('Viaje creado exitosamente:', res.data);
        recargarViajes();
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error al crear viaje:', error);
        alert("Error al crear el viaje");
      });
  };

  // Crear múltiples viajes (uno por cada ruta)
  const handleSaveMultipleViajes = async (viajesData) => {
    try {
      const { fecha_salida, fecha_llegada, numero_asientos_ocupados, precio, rutas } = viajesData;
      
      // Filtrar rutas válidas (que tengan ID)
      const rutasValidas = rutas.filter(ruta => ruta.id);
      
      if (rutasValidas.length === 0) {
        alert('No hay rutas válidas para crear viajes');
        return;
      }

      if (!window.confirm(`¿Estás seguro de que deseas crear ${rutasValidas.length} viajes (uno por cada ruta) para la fecha ${fecha_salida}?\n\nNota: Los viajes se crearán sin unidades asignadas. Podrá asignar las unidades después usando el botón "Actualizar".`)) {
        return;
      }

      console.log(`Creando ${rutasValidas.length} viajes...`);
      
      // Crear un viaje para cada ruta (sin asignar unidades)
      const promesasViajes = rutasValidas.map((ruta) => {        
        const nuevoViaje = {
          fecha_salida,
          fecha_llegada: fecha_llegada || fecha_salida,
          numero_asientos_ocupados,
          precio,
          ruta_id: ruta.id
          // No incluir unidad_id - se asignará después
        };
        
        return axios.post(API_URL_Viajes_CRUD, nuevoViaje);
      });

      // Ejecutar todas las promesas
      const resultados = await Promise.allSettled(promesasViajes);
      
      // Contar éxitos y fallos
      const exitosos = resultados.filter(r => r.status === 'fulfilled').length;
      const fallidos = resultados.filter(r => r.status === 'rejected').length;
      
      if (exitosos > 0) {
        console.log(`${exitosos} viajes creados exitosamente`);
        recargarViajes();
        setShowModal(false);
        
        if (fallidos > 0) {
          const errores = resultados
            .filter(r => r.status === 'rejected')
            .map(r => r.reason?.response?.data?.message || 'Error desconocido')
            .join('\n');
          alert(`Se crearon ${exitosos} viajes exitosamente, pero ${fallidos} fallaron.\n\nLos viajes creados no tienen unidades asignadas. Use el botón "Actualizar" para asignar unidades y precios.\n\nErrores:\n${errores}`);
        } else {
          alert(`¡Éxito! Se crearon ${exitosos} viajes para todas las rutas.\n\nLos viajes no tienen unidades asignadas. Use el botón "Actualizar" para asignar unidades y modificar precios.`);
        }
      } else {
        const errores = resultados
          .filter(r => r.status === 'rejected')
          .map(r => r.reason?.response?.data?.message || 'Error desconocido')
          .join('\n');
        alert(`No se pudo crear ningún viaje.\n\nErrores:\n${errores}`);
      }
      
    } catch (error) {
      console.error('Error al crear múltiples viajes:', error);
      alert('Error inesperado al crear los viajes múltiples');
    }
  };

  // Actualizar viaje (solo precio y unidad)
  const handleUpdateViaje = (datosActualizados) => {
    if (!viajeEdit) return;
    
    const viajeCompleto = {
      ...viajeEdit,
      precio: datosActualizados.precio,
      unidad_id: datosActualizados.unidad_id,
      // Mantener los otros campos del viaje original
      fecha_salida: viajeEdit.fecha_salida,
      fecha_llegada: viajeEdit.fecha_llegada,
      numero_asientos_ocupados: viajeEdit.numero_asientos_ocupados,
      ruta_id: viajeEdit.ruta_id
    };

    axios.put(`${API_URL_Viajes_CRUD}/${viajeEdit.id}`, viajeCompleto)
      .then(res => {
        console.log('Viaje actualizado exitosamente:', res.data);
        recargarViajes();
        setShowUpdateModal(false);
        setViajeEdit(null);
      })
      .catch(error => {
        console.error('Error al actualizar viaje:', error);
        alert("Error al actualizar el viaje");
      });
  };

  // Abrir modal para agregar
  const handleAgregar = () => {
    console.log('Abriendo modal para agregar');
    setShowModal(true);
  };

  // Abrir modal para actualizar (solo precio y unidad)
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
    console.log('Abriendo modal para actualizar viaje:', viaje);
    setViajeEdit(viaje);
    setShowUpdateModal(true);
  };

  // Eliminar viaje
  const handleEliminar = () => {
    if (!selectedId) return;
    const viaje = viajes.find(v => v.id === selectedId);
    if (!viaje) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este viaje?')) {
      axios.delete(`${API_URL_Viajes_CRUD}/${viaje.id}`)
        .then((res) => {
          console.log('Viaje eliminado exitosamente:', res.data);
          setViajes(prev => prev.filter(v => v.id !== viaje.id));
          setSelectedId(null);
        })
        .catch(error => {
          console.error('Error al eliminar viaje:', error);
          alert("Error al eliminar el viaje");
        });
    }
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

      {/* Modal para crear viaje */}
      <ViajeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveViaje}
        onSaveMultiple={handleSaveMultipleViajes}
        rutas={rutas}
        unidades={unidades}
      />

      {/* Modal para actualizar viaje (solo precio y unidad) */}
      <ViajeUpdateModal
        open={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setViajeEdit(null);
        }}
        onSave={handleUpdateViaje}
        initialData={viajeEdit}
      />
    </div>
  );
};

export default ViajesPanel;
