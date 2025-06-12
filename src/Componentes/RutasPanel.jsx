import React, { useState } from 'react';
import './Estilos/Admin.css';

import Header from './Header';           // ✅ Faltaba importar
import RoutesTable from './RoutesTable';
import ActionButtons from './ActionButtons';
import ParadasModal from './ParadasModal';
import RutaForm from './RutaForm';
<<<<<<< HEAD
import Header from './Header';
import Footer from './Footer';
import Button from './Button';
import './Estilos/Admin.css'; 
=======
import Footer from './Footer';
>>>>>>> c43da899812204d4b79e19fa4020ac13d6e6e4b7

const RutasPanel = () => {
  const [showModal, setShowModal] = useState(false);
  const [isAddingRoute, setIsAddingRoute] = useState(false);

  const abrirParadas = () => setShowModal(true);
  const cerrarParadas = () => setShowModal(false);
  const abrirFormRuta = () => setIsAddingRoute(true);
  const cerrarFormRuta = () => setIsAddingRoute(false);

  if (isAddingRoute) {
    return <RutaForm onBack={cerrarFormRuta} />;
  }

  return (
    <div>
      <Header userLabel="Administrador" />

      <section className="rutas-panel">
        <h1 className="rutas-title">Rutas</h1>

        <div className="rutas-content">
          {/* Tabla de rutas */}
          <div className="rutas-table-wrapper">
            <RoutesTable onParadasClick={abrirParadas} />
          </div>

          {/* Botones de acción */}
          <ActionButtons
            onAdd={abrirFormRuta}
            onDelete={() => {
              /* tu lógica de eliminar */
            }}
            onUpdate={() => {
              /* tu lógica de actualizar */
            }}
          />
        </div>

        {/* Modal de paradas */}
        {showModal && <ParadasModal onClose={cerrarParadas} />}
      </section>

      <Footer />
    </div>
  );
};

export default RutasPanel;

