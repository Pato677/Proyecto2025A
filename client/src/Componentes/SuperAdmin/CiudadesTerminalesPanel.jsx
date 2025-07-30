import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PaginacionPanel from './PaginacionPanel';
import AgregarTerminalModal from './AgregarTerminalModal';
import '../Estilos/SuperAdminDashboard.css';

const CiudadesTerminalesPanel = () => {
  const [ciudadesTerminales, setCiudadesTerminales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [terminalToEdit, setTerminalToEdit] = useState(null);
  const porPagina = 5;

  // Función para cargar datos desde el servidor
  const cargarCiudadesTerminales = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/ciudades-terminales/plano');
      
      if (response.data.success) {
        setCiudadesTerminales(response.data.data);
        setError(null);
      } else {
        setError('Error al cargar los datos');
      }
    } catch (err) {
      console.error('Error al cargar ciudades y terminales:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarCiudadesTerminales();
  }, []);

  // Calcular paginación
  const totalPaginas = Math.ceil(ciudadesTerminales.length / porPagina);
  const datossPagina = ciudadesTerminales.slice((pagina - 1) * porPagina, pagina * porPagina);

  // Función para manejar el guardado desde el modal
  const handleSaveFromModal = () => {
    cargarCiudadesTerminales(); // Recargar los datos
    setShowModal(false); // Cerrar el modal
    setTerminalToEdit(null); // Limpiar terminal en edición
  };

  // Función para abrir modal en modo agregar
  const handleAgregar = () => {
    setTerminalToEdit(null);
    setShowModal(true);
  };

  // Función para abrir modal en modo editar
  const handleEditar = (terminal) => {
    setTerminalToEdit(terminal);
    setShowModal(true);
  };

  // Función para cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setTerminalToEdit(null);
  };

  // Función para manejar la eliminación
  const handleEliminar = async (terminalId) => {
    if (window.confirm('¿Está seguro que desea eliminar este terminal?')) {
      try {
        await axios.delete(`http://localhost:8000/terminales/${terminalId}`);
        cargarCiudadesTerminales(); // Recargar datos
      } catch (err) {
        console.error('Error al eliminar terminal:', err);
        alert('Error al eliminar el terminal');
      }
    }
  };

  if (loading) {
    return (
      <div className="panel-box">
        <h3>Ciudades y Terminales</h3>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando datos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel-box">
        <h3>Ciudades y Terminales</h3>
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          {error}
          <br />
          <button 
            className="btn-outline" 
            onClick={cargarCiudadesTerminales}
            style={{ marginTop: '10px' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-box">
      <h3>Ciudades y Terminales</h3>
      {ciudadesTerminales.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          No hay datos disponibles
        </div>
      ) : (
        <>
          <table className="panel-table">
            <thead>
              <tr>
                <th>Ciudad</th>
                <th>Terminal</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datossPagina.map(item => (
                <tr key={item.id}>
                  <td>{item.ciudad_nombre}</td>
                  <td>{item.terminal_nombre}</td>
                  <td>{item.terminal_direccion || 'No especificada'}</td>
                  <td>
                    <button 
                      className="btn-outline" 
                      title="Editar"
                      onClick={() => handleEditar(item)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-eliminar" 
                      title="Eliminar"
                      onClick={() => handleEliminar(item.terminal_id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <PaginacionPanel
            paginaActual={pagina}
            totalPaginas={totalPaginas}
            onChange={setPagina}
          />
        </>
      )}
      <button 
        className="btn-agregar"
        onClick={handleAgregar}
      >
        Agregar Ciudad/Terminal
      </button>

      <AgregarTerminalModal
        open={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveFromModal}
        terminalToEdit={terminalToEdit}
      />
    </div>
  );
};

export default CiudadesTerminalesPanel;