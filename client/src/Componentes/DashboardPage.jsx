import React, { useState } from 'react';
import HeaderAdmin from './HeaderAdmin';
import Footer from './Footer';
import PerfilUsuarioModal from './PerfilUsuarioModal';
import RegistrarUnidadesPage from './RegistrarUnidadesPage';
import RutasPanel from './RutasPanel';
import ConductoresPage from './ConductoresPage';
import ViajesPanel from './ViajesPanel';
import { useAuth } from './AuthContext';
import './Estilos/DashboardAdmin.css';

// Paneles disponibles - similar a SuperAdminDashboard
const panels = [
  { key: 'unidades', label: 'Unidades', component: <RegistrarUnidadesPage />, available: true },
  { key: 'viajes', label: 'Viajes', component: <ViajesPanel />, available: true },
  { key: 'rutas', label: 'Rutas', component: <RutasPanel />, available: true },
  { key: 'conductores', label: 'Conductores y Controladores', component: <ConductoresPage />, available: true },
];

function DashboardPage() {
  const { usuario } = useAuth();
  const [selectedModule, setSelectedModule] = useState(null);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  
  // Encontrar el panel seleccionado
  const selectedPanel = panels.find(p => p.key === selectedModule);

  const handleModuleClick = (moduleName) => {
    const panel = panels.find(p => p.key === moduleName);
    if (panel && panel.available) {
      setSelectedModule(moduleName);
    }
  };

  // Función para manejar el modal de perfil
  const handlePerfilClick = () => {
    // Bloquear acceso al perfil para superusers
    if (usuario && usuario.rol === 'superuser') {
      alert('⚠️ El perfil del Superadministrador está protegido y no puede ser modificado por seguridad.');
      return;
    }
    setMostrarPerfil(true);
  };

  // Función para renderizar el contenido principal
  const renderMainContent = () => {
    if (!selectedModule) {
      return (
        <div className="welcome-panel">
          <div className="panel-box">
            <h3>Bienvenido al Panel Administrativo</h3>
            <p>Selecciona un módulo del menú lateral para comenzar a gestionar:</p>
            <ul className="module-list">
              <li><strong>Unidades:</strong> Registra y administra unidades de transporte</li>
              <li><strong>Viajes:</strong> Gestiona viajes y horarios de transporte</li>
              <li><strong>Rutas:</strong> Configura y administra rutas de transporte</li>
              <li><strong>Conductores y Controladores:</strong> Administra el personal</li>
            </ul>
          </div>
        </div>
      );
    }

    if (selectedModule === 'horarios') {
      return (
        <div className="welcome-panel">
          <div className="panel-box">
            <h3>Módulo de Horarios</h3>
            <p className="panel-info">Este módulo está en desarrollo y estará disponible próximamente.</p>
          </div>
        </div>
      );
    }

    return selectedPanel ? selectedPanel.component : null;
  };

  const dashboardModules = [
    { key: 'unidades', label: 'Unidades', available: true },
    { key: 'viajes', label: 'Viajes', available: true },
    { key: 'rutas', label: 'Rutas', available: true },
    { key: 'conductores', label: 'Conductores y Controladores', available: true },
  ];

  return (
    <div className="dashboard-grid-layout">
      <HeaderAdmin onPerfilClick={handlePerfilClick} />
      <div className="dashboard-admin">
        <aside className="dashboard-sidebar">
          <h2>Panel Administrativo</h2>
          <nav>
            {dashboardModules.map(module => (
              <button
                key={module.key}
                className={`${!module.available ? 'disabled' : ''} ${selectedModule === module.key ? 'active' : ''}`}
                onClick={() => handleModuleClick(module.key)}
                disabled={!module.available}
              >
                {module.label}
                {!module.available && <span className="dev-badge">En desarrollo</span>}
              </button>
            ))}
          </nav>
        </aside>
        <main className="dashboard-main">
          {renderMainContent()}
        </main>
      </div>
      <Footer />

      {/* Modal de Perfil */}
      {mostrarPerfil && (
        <PerfilUsuarioModal
          cerrar={() => setMostrarPerfil(false)}
        />
      )}
    </div>
  );
}

export default DashboardPage;