import React, { useState } from 'react';
import HeaderAdmin from './HeaderAdmin';
import Footer from './Footer';
import CiudadesTerminalesPanel from './SuperAdmin/CiudadesTerminalesPanel';
import SolicitudesCooperativasPanel from './SuperAdmin/SolicitudesCooperativasPanel';
import UsuariosCooperativasPanel from './SuperAdmin/UsuariosCooperativasPanel';
import CooperativaUnidadesPanel from './SuperAdmin/CooperativaUnidadesPanel';
import HorariosPanel from './SuperAdmin/HorariosPanel';
import RutasPanel from './SuperAdmin/RutasPanel';
import ConductoresPanel from './SuperAdmin/ConductoresPanel';
import './Estilos/SuperAdminDashboard.css';

const panels = [
  { key: 'ciudades', label: 'Ciudades y Terminales', component: <CiudadesTerminalesPanel /> },
  { key: 'solicitudes', label: 'Solicitudes Cooperativas', component: <SolicitudesCooperativasPanel /> },
  { key: 'usuarios', label: 'Usuarios y Cooperativas', component: <UsuariosCooperativasPanel /> },
  { key: 'cooperativas', label: 'Unidades de Cooperativas', component: <CooperativaUnidadesPanel /> },
  { key: 'horarios', label: 'Horarios', component: <HorariosPanel /> },
  { key: 'rutas', label: 'Rutas', component: <RutasPanel /> },
  { key: 'personal', label: 'Conductores y Controladores', component: <ConductoresPanel /> },
];

const SuperAdminDashboard = () => {
  const [selected, setSelected] = useState('ciudades');
  const panel = panels.find(p => p.key === selected);

  return (
    <div className="superadmin-grid-layout">
      <HeaderAdmin />
      <div className="superadmin-dashboard">
        <aside className="superadmin-sidebar">
          <h2>Panel Superusuario</h2>
          <nav>
            {panels.map(p => (
              <button
                key={p.key}
                className={selected === p.key ? 'active' : ''}
                onClick={() => setSelected(p.key)}
              >
                {p.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="superadmin-main">
          {panel.component}
        </main>
      </div>
      <footer>
      <Footer />
      </footer>
    </div>
  );
};

export default SuperAdminDashboard;