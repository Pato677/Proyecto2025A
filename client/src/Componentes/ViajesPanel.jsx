import React, { useEffect, useState, useCallback } from 'react';
import ViajesTable from './ViajesTable';
import ActionButtons from './ActionButtons';
import ViajeModal from './ViajeModal';
import ViajeUpdateModal from './ViajeUpdateModal';
import ErrorModal from './ErrorModal';
import ConfirmModal from './ConfirmModal';
import { useAuth } from './AuthContext';
import './Estilos/ViajesPanel.css';
import axios from 'axios';

const viajesPorPagina = 4;

const ViajesPanel = () => {
  const { usuario } = useAuth(); // Obtener el usuario del contexto
  
  // Todos los hooks deben ir antes de cualquier early return
  const [viajes, setViajes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [viajeEdit, setViajeEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rutas, setRutas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [asientosOcupados, setAsientosOcupados] = useState({});
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estados para modales de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');
  
  // Función para mostrar error modal
  const mostrarError = (mensaje) => {
    setErrorMessage(mensaje);
    setShowErrorModal(true);
  };

  // Función para mostrar modal de confirmación
  const mostrarConfirmacion = (titulo, mensaje, accion) => {
    setConfirmTitle(titulo);
    setConfirmMessage(mensaje);
    setConfirmAction(() => accion);
    setShowConfirmModal(true);
  };
  
  // Obtener el ID de la cooperativa del usuario logueado
  const cooperativaId = usuario?.cooperativa_id;
  
  // Rutas de la API usando el ID dinámico de la cooperativa
  const API_URL_Viajes = cooperativaId ? `http://localhost:8000/viajes/cooperativa/${cooperativaId}/vigentes` : null;
  const API_URL_Viajes_CRUD = "http://localhost:8000/viajes"; // Para crear, actualizar y eliminar

  // 🪑 Cargar asientos ocupados para todos los viajes
  const cargarAsientosOcupados = useCallback(async (viajesData) => {
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
  }, []);

  // 🔄 Recargar viajes desde el servidor con paginación
  const recargarViajes = useCallback((page = currentPage) => {
    if (!API_URL_Viajes) return; // Si no hay URL, no hacer nada
    
    // Agregar parámetros de paginación a la URL
    const urlConPaginacion = `${API_URL_Viajes}?page=${page}&limit=${viajesPorPagina}`;
    console.log(`📄 Cargando página ${page} con URL:`, urlConPaginacion);
    
    axios.get(urlConPaginacion)
      .then(res => {
        console.log('Respuesta completa del servidor:', res.data);
        
        if (res.data.success && res.data.data) {
          console.log('📅 Fechas de viajes RECIBIDOS desde el backend:', res.data.data.map(viaje => ({
            id: viaje.id,
            fecha_salida: viaje.fecha_salida,
            fecha_llegada: viaje.fecha_llegada,
            tipo_fecha_salida: typeof viaje.fecha_salida,
            tipo_fecha_llegada: typeof viaje.fecha_llegada
          })));
          
          setViajes(res.data.data);
          
          // Actualizar información de paginación
          if (res.data.pagination) {
            setPaginationInfo({
              totalPages: res.data.pagination.totalPages,
              totalItems: res.data.pagination.totalItems,
              hasNextPage: res.data.pagination.hasNextPage,
              hasPrevPage: res.data.pagination.hasPrevPage
            });
            console.log('📊 Información de paginación:', res.data.pagination);
          }
          
          console.log(`Viajes vigentes cargados desde backend (página ${page}):`, res.data.data.length);
          
          // Cargar asientos ocupados para cada viaje de esta página
          cargarAsientosOcupados(res.data.data);
        } else {
          console.log('No hay viajes vigentes o respuesta sin éxito');
          setViajes([]);
          setAsientosOcupados({});
          setPaginationInfo({
            totalPages: 0,
            totalItems: 0,
            hasNextPage: false,
            hasPrevPage: false
          });
        }
      })
      .catch(error => {
        console.error('Error al cargar viajes:', error);
        setViajes([]);
        setAsientosOcupados({});
        setPaginationInfo({
          totalPages: 0,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: false
        });
      });
  }, [API_URL_Viajes, cargarAsientosOcupados, currentPage]);

  // Cargar viajes, rutas y unidades al inicio
  useEffect(() => {
    if (!cooperativaId) return; // Si no hay cooperativaId, no hacer nada
    
    recargarViajes();

    // Cargar rutas específicas de la cooperativa
    axios.get(`http://localhost:8000/rutas/cooperativa/${cooperativaId}`)
      .then(res => {
        console.log('Respuesta de rutas por cooperativa:', res.data);
        if (res.data.success && res.data.data) {
          setRutas(res.data.data);
          console.log(`Rutas cargadas para cooperativa ${cooperativaId}:`, res.data.data.length);
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
    axios.get(`http://localhost:8000/unidades/cooperativa/${cooperativaId}`)
      .then(res => {
        console.log('Respuesta de unidades por cooperativa:', res.data);
        if (res.data.success && res.data.data) {
          setUnidades(res.data.data);
          console.log(`Unidades cargadas para cooperativa ${cooperativaId}:`, res.data.data.length);
        } else {
          console.log('No hay unidades para esta cooperativa');
          setUnidades([]);
        }
      })
      .catch(error => {
        console.error('Error al cargar unidades de la cooperativa:', error);
        setUnidades([]);
      });
  }, [recargarViajes, cooperativaId]); // Agregada la dependencia cooperativaId
  
  // Verificar que el usuario sea de tipo cooperativa y tenga ID
  if (!cooperativaId) {
    return (
      <div className="viajes-panel-container">
        <main className="viajes-panel-main">
          <section className="viajes-panel">
            <h1 className="viajes-title">Viajes</h1>
            <p>Error: No se pudo obtener el ID de la cooperativa. Asegúrese de estar logueado como cooperativa.</p>
          </section>
        </main>
      </div>
    );
  }

  // Usar información de paginación del servidor
  const totalPaginas = paginationInfo.totalPages;
  
  // Los viajes ya vienen paginados del servidor, no necesitamos slice
  // Agregar información de asientos ocupados a los viajes
  const viajesConAsientos = viajes.map(viaje => ({
    ...viaje,
    asientos_ocupados_reales: asientosOcupados[viaje.id] || 0
  }));

  // Crear nuevo viaje
  const handleSaveViaje = (nuevoViaje) => {
    console.log('📅 Fechas ANTES de enviar al backend:', {
      fecha_salida: nuevoViaje.fecha_salida,
      fecha_llegada: nuevoViaje.fecha_llegada,
      tipo_fecha_salida: typeof nuevoViaje.fecha_salida,
      tipo_fecha_llegada: typeof nuevoViaje.fecha_llegada
    });
    
    axios.post(API_URL_Viajes_CRUD, nuevoViaje)
      .then(res => {
        console.log('Viaje creado exitosamente:', res.data);
        console.log('📅 Fechas DESPUÉS del backend:', {
          fecha_salida: res.data.data?.fecha_salida,
          fecha_llegada: res.data.data?.fecha_llegada
        });
        // Recargar primera página para ver el nuevo viaje
        setCurrentPage(1);
        recargarViajes(1);
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error al crear viaje:', error);
        console.log('Error del servidor:', error.response?.data?.message || error.message);
        mostrarError("Error al crear el viaje");
      });
  };

  // Crear múltiples viajes (uno por cada ruta)
  const handleSaveMultipleViajes = async (viajesData) => {
    try {
      const { fecha_salida, fecha_llegada, numero_asientos_ocupados, precio, rutas } = viajesData;
      
      // Filtrar rutas válidas (que tengan ID)
      const rutasValidas = rutas.filter(ruta => ruta.id);
      
      if (rutasValidas.length === 0) {
        mostrarError('No hay rutas válidas para crear viajes');
        return;
      }

      // Mostrar modal de confirmación en lugar de window.confirm
      const mensaje = `¿Estás seguro de que deseas crear ${rutasValidas.length} viajes (uno por cada ruta) para la fecha ${fecha_salida}?\n\nNota: Los viajes se crearán sin unidades asignadas. Podrá asignar las unidades después usando el botón "Actualizar".`;
      
      mostrarConfirmacion(
        'Crear Múltiples Viajes',
        mensaje,
        () => crearViajesMultiples(viajesData)
      );
    } catch (error) {
      console.error('Error al crear múltiples viajes:', error);
      console.log('Error inesperado:', error.message);
      mostrarError('Error inesperado al crear los viajes múltiples');
    }
  };

  // Función separada para crear los viajes múltiples
  const crearViajesMultiples = async (viajesData) => {
    try {
      const { fecha_salida, fecha_llegada, numero_asientos_ocupados, precio, rutas } = viajesData;
      const rutasValidas = rutas.filter(ruta => ruta.id);

      console.log(`Creando ${rutasValidas.length} viajes...`);
      console.log('📅 Fechas ANTES de crear múltiples viajes:', {
        fecha_salida: fecha_salida,
        fecha_llegada: fecha_llegada,
        tipo_fecha_salida: typeof fecha_salida,
        tipo_fecha_llegada: typeof fecha_llegada
      });
      
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
        
        console.log(`📅 Viaje para ruta ${ruta.id} con fechas:`, {
          fecha_salida: nuevoViaje.fecha_salida,
          fecha_llegada: nuevoViaje.fecha_llegada
        });
        
        return axios.post(API_URL_Viajes_CRUD, nuevoViaje);
      });

      // Ejecutar todas las promesas
      const resultados = await Promise.allSettled(promesasViajes);
      
      // Contar éxitos y fallos
      const exitosos = resultados.filter(r => r.status === 'fulfilled').length;
      const fallidos = resultados.filter(r => r.status === 'rejected').length;
      
      if (exitosos > 0) {
        console.log(`${exitosos} viajes creados exitosamente`);
        // Recargar primera página para ver los nuevos viajes
        setCurrentPage(1);
        recargarViajes(1);
        setShowModal(false);
        
        if (fallidos > 0) {
          const errores = resultados
            .filter(r => r.status === 'rejected')
            .map(r => r.reason?.response?.data?.message || 'Error desconocido')
            .join('\n');
          console.log('Errores del servidor al crear viajes:', errores);
          mostrarError(`Se crearon ${exitosos} viajes exitosamente, pero ${fallidos} fallaron.\n\nLos viajes creados no tienen unidades asignadas. Use el botón "Actualizar" para asignar unidades y precios.\n\nErrores:\n${errores}`);
        } else {
          console.log(`✅ ${exitosos} viajes creados exitosamente para todas las rutas`);
          mostrarError(`¡Éxito! Se crearon ${exitosos} viajes para todas las rutas.\n\nLos viajes no tienen unidades asignadas. Use el botón "Actualizar" para asignar unidades y modificar precios.`);
        }
      } else {
        const errores = resultados
          .filter(r => r.status === 'rejected')
          .map(r => r.reason?.response?.data?.message || 'Error desconocido')
          .join('\n');
        console.log('Errores del servidor al crear viajes:', errores);
        mostrarError(`No se pudo crear ningún viaje.\n\nErrores:\n${errores}`);
      }
      
    } catch (error) {
      console.error('Error al crear múltiples viajes:', error);
      console.log('Error inesperado:', error.message);
      mostrarError('Error inesperado al crear los viajes múltiples');
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
        // Mantener la página actual para ver el viaje actualizado
        recargarViajes(currentPage);
        setShowUpdateModal(false);
        setViajeEdit(null);
      })
      .catch(error => {
        console.error('Error al actualizar viaje:', error);
        console.log('Error del servidor:', error.response?.data?.message || error.message);
        mostrarError("Error al actualizar el viaje");
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
    
    // Mostrar modal de confirmación en lugar de window.confirm
    mostrarConfirmacion(
      'Eliminar Viaje',
      `¿Estás seguro de que deseas eliminar este viaje?\n\nRuta: ${viaje.ruta_numero || 'N/A'}\nFecha: ${viaje.fecha_salida}\nEsta acción no se puede deshacer.`,
      () => confirmarEliminarViaje(viaje)
    );
  };

  // Función separada para confirmar eliminación
  const confirmarEliminarViaje = (viaje) => {
    axios.delete(`${API_URL_Viajes_CRUD}/${viaje.id}`)
      .then((res) => {
        console.log('Viaje eliminado exitosamente:', res.data);
        setSelectedId(null);
        // Recargar página actual o ir a la anterior si quedó vacía
        if (viajes.length === 1 && currentPage > 1) {
          const nuevaPagina = currentPage - 1;
          setCurrentPage(nuevaPagina);
          recargarViajes(nuevaPagina);
        } else {
          recargarViajes(currentPage);
        }
        mostrarError('✅ Viaje eliminado exitosamente');
      })
      .catch(error => {
        console.error('Error al eliminar viaje:', error);
        console.log('Error del servidor:', error.response?.data?.message || error.message);
        mostrarError("Error al eliminar el viaje");
      });
  };

  const handlePageChange = (num) => {
    console.log(`📄 Cambiando a página ${num}`);
    setCurrentPage(num);
    setSelectedId(null); // Limpiar selección al cambiar página
    recargarViajes(num); // Cargar viajes de la nueva página
  };

  // Función para generar los números de página a mostrar
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Máximo número de páginas visibles
    
    if (totalPaginas <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPaginas; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Si hay muchas páginas, mostrar solo un rango
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPaginas, currentPage + 2);
      
      // Ajustar el rango para mantener 5 páginas visibles cuando sea posible
      if (endPage - startPage + 1 < maxVisiblePages) {
        if (startPage === 1) {
          endPage = Math.min(totalPaginas, startPage + maxVisiblePages - 1);
        } else if (endPage === totalPaginas) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
      }
      
      // Agregar primera página y puntos suspensivos si es necesario
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }
      
      // Agregar páginas del rango actual
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Agregar puntos suspensivos y última página si es necesario
      if (endPage < totalPaginas) {
        if (endPage < totalPaginas - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPaginas);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="viajes-panel-container">
      <main className="viajes-panel-main">
        <section className="viajes-panel">
          <h1 className="viajes-title">Viajes</h1>
          <div className="viajes-content">
            <div className="viajes-table-wrapper">
              <ViajesTable
                viajes={viajesConAsientos}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />

              {/* Paginación */}
              <div className="pagination">
                {/* Botón primera página */}
                {totalPaginas > 5 && currentPage > 3 && (
                  <button 
                    className="nav-button"
                    onClick={() => handlePageChange(1)} 
                    title="Primera página"
                  >
                    &#8676;
                  </button>
                )}
                
                <button 
                  className="nav-button"
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1 || !paginationInfo.hasPrevPage}
                  title="Página anterior"
                >
                  &#8249;
                </button>
                
                {generatePageNumbers().map((pageNum, index) => 
                  pageNum === '...' ? (
                    <span key={`ellipsis-${index}`} className="ellipsis">
                      &#8230;
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      className={currentPage === pageNum ? 'active' : ''}
                      onClick={() => handlePageChange(pageNum)}
                      title={`Página ${pageNum}`}
                    >
                      {pageNum}
                    </button>
                  )
                )}
                
                <button 
                  className="nav-button"
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPaginas || !paginationInfo.hasNextPage}
                  title="Página siguiente"
                >
                  &#8250;
                </button>
                
                {/* Botón última página */}
                {totalPaginas > 5 && currentPage < totalPaginas - 2 && (
                  <button 
                    className="nav-button"
                    onClick={() => handlePageChange(totalPaginas)} 
                    title="Última página"
                  >
                    &#8677;
                  </button>
                )}
              </div>
              
              {/* Información de paginación */}
              {paginationInfo.totalItems > 0 && (
                <div className="pagination-info">
                  <p>
                    Mostrando {((currentPage - 1) * viajesPorPagina) + 1} - {Math.min(currentPage * viajesPorPagina, paginationInfo.totalItems)} de {paginationInfo.totalItems} viajes vigentes
                  </p>
                  <p>
                    Página {currentPage} de {totalPaginas}
                  </p>
                </div>
              )}
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
        cooperativaId={cooperativaId}
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
        cooperativaId={cooperativaId}
      />

      {/* Modal de error */}
      <ErrorModal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <ConfirmModal
          open={showConfirmModal}
          title={confirmTitle}
          onCancel={() => {
            setShowConfirmModal(false);
            setConfirmAction(null);
          }}
          onConfirm={() => {
            if (confirmAction) {
              confirmAction();
            }
            setShowConfirmModal(false);
            setConfirmAction(null);
          }}
        >
          {confirmMessage.split('\n').map((line, index) => (
            <p key={index} style={{ margin: '5px 0' }}>
              {line}
            </p>
          ))}
        </ConfirmModal>
      )}
    </div>
  );
};

export default ViajesPanel;
