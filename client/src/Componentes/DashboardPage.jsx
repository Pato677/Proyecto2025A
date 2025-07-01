import React from 'react';
import HeaderAdmin from './HeaderAdmin';
import Footer from './Footer';
import './Estilos/DashboardAdmin.css';
import Unidades from './Imagenes/Unidades.png'; // Asegúrate de que la ruta sea correcta
import Horarios from './Imagenes/Horarios.png'; // Asegúrate de que la ruta sea correcta
import Rutas from './Imagenes/RutasAdmin.png'; // Asegúrate de que la ruta sea correcta

function DashboardPage() {
  return (
    <div className="dashboard-admin-page">
      <HeaderAdmin />

      <main className="dashboard-admin-main">
        <div className="dashboard-admin-box">
          <h2 className="dashboard-admin-title">Módulos</h2>
          <hr className="dashboard-admin-divider" />
          <div className="dashboard-admin-modules">
            <div className="dashboard-admin-module-card">
              <img src={Unidades} alt="Unidades" className="dashboard-admin-module-icon" />
              <a href="#" className="dashboard-admin-module-button">Unidades</a>
            </div>
            <div className="dashboard-admin-module-card">
              <img src={Horarios} alt="Horarios" className="dashboard-admin-module-icon" />
              <a href="#" className="dashboard-admin-module-button">Horarios</a>
            </div>
            <div className="dashboard-admin-module-card">
              <img src={Rutas} alt="Rutas" className="dashboard-admin-module-icon" />
              <a href="#" className="dashboard-admin-module-button">Rutas</a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DashboardPage;