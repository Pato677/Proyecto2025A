import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Estilos/styles.css';

function DashboardPage() {
  return (
    <div className="ticket-page">
      <Header showStep={false} />

      <main className="main-content">
        <div className="dashboard-box">
          <h2>Módulos</h2>
          <hr className="divider" />
          <div className="modules-grid">
            <div className="module-card">
              <img src="https://i.imgur.com/nZkTvcF.png" alt="Unidades" className="module-icon" />
              <a href="#" className="module-button">Unidades</a>
            </div>
            <div className="module-card">
              <img src="https://i.imgur.com/ErO2aXZ.png" alt="Horarios" className="module-icon" />
              <a href="#" className="module-button">Horarios</a>
            </div>
            <div className="module-card">
              <img src="https://i.imgur.com/NxyTfLf.png" alt="Rutas" className="module-icon" />
              <a href="#" className="module-button">Rutas</a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DashboardPage;
