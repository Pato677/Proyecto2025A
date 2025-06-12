import React, { useState } from 'react';
import RoutesTable from './RoutesTable';
import ActionButtons from './ActionButtons';
import ParadasModal from './ParadasModal';
import RutaForm from './RutaForm';
import Header from './Header';
import Footer from './Footer';
import Button from './Button';
import './Estilos/Admin.css'; 

const RutasPanel = () => {
  // 1️⃣ Estado para mostrar/ocultar modal
  const [showModal, setShowModal] = useState(false);
  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const abrirParadas = () => setShowModal(true);
  const cerrarParadas = () => setShowModal(false);
   // dispara vista de creación de ruta
  const abrirFormRuta = () => setIsAddingRoute(true);

  // Volver a lista (quizá más tarde lo manejes con router)
//  const volverALaLista = () => setIsAddingRoute(false);

  if (isAddingRoute) {
    return <RutaForm onBack={() => setIsAddingRoute(false)} />;
  }
  
  return (
    <div>
      <Header userLabel='Administrador'></Header>
      <section className="rutas-panel">
        <h1 className="rutas-title">Rutas</h1>
        <div className="rutas-content">
          <div className="rutas-table-wrapper">
            {/* 1️⃣ Click en ruta dispara abrirParadas */}
            <RoutesTable onParadasClick={abrirParadas} />
          </div>
          {/* 2️⃣ Click en Agregar dispara abrirParadas (más tarde lo cambiarás por navegación) */}
          <ActionButtons
            onAdd={abrirFormRuta}
            onDelete={() => {/* tu lógica de eliminar */}}
            onUpdate={() => {/* tu lógica de actualizar */}}
          />
        </div>

        {/* 3️⃣ Mismo modal, sin cambios de estilo */}
        {showModal && <ParadasModal onClose={cerrarParadas} />}
        
      </section>
      <div className= "btnAtras">
        <Button text="Atras" width='120px' />

      </div>
      <Footer></Footer>
    </div>
  );
  
};

export default RutasPanel;
