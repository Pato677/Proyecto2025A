import React, { useState } from 'react';
import HeaderAdmin from './HeaderAdmin';
import RoutesTable from './RoutesTable';
import ActionButtons from './ActionButtons';
import ParadasModal from './ParadasModal';
import RutaForm from './RutaForm';
import Footer from './Footer';
import './Estilos/RutasPanel.css';
import './Estilos/Footer.css';

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
    <div className="rutas-panel-container">
      <HeaderAdmin/>
      <main className="rutas-panel-main">
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
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default RutasPanel;

