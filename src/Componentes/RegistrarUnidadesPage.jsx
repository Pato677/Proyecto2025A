import React, { useEffect, useState } from 'react';
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

  // Buscar la unidad seleccionada en el array
  const unidadSeleccionada = unidades.find(u => u.id === selectedId);

  // Guardar nueva unidad
  const handleSaveUnidad = (nuevaUnidad) => {
    // Generar un id único (puedes mejorarlo según tu lógica)
    const newId = unidades.length > 0 ? Math.max(...unidades.map(u => Number(u.id))) + 1 : 1;
    const unidadConId = { ...nuevaUnidad, id: newId };
    axios.post('http://localhost:3000/unidades', unidadConId)
      .then(res => {
        setUnidades(prev => [...prev, res.data]);
        setShowModal(false);
        setSelectedId(res.data.id);
      });
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
                {unidades.length > 0 ? (
                  unidades.map((unidad) => (
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
          </div>
          <div className="register-units-image-box">
            <img
              src={unidadSeleccionada?.imagen || "https://via.placeholder.com/400x200?text=Sin+imagen"}
              alt="Bus"
              className="register-units-image"
            />
            <button className="register-units-upload-btn">Subir imagen</button>
          </div>
        </div>

        <div className="register-units-btn-group">
          <button className="register-units-btn" onClick={() => setShowModal(true)}>Agregar</button>
          <button className="register-units-btn">Eliminar</button>
          <button className="register-units-btn">Actualizar</button>
        </div>

        <div className="register-units-btn-group">
          <Button text="Atras" width='200px'/>
          <Button text="Ver Ubicacion" width='200px'/>
        </div>
      </main>

      <Footer />

      <UnidadModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveUnidad}
      />
    </div>
  );
}

export default RegisterUnitsPage;