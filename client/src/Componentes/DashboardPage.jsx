import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from './HeaderAdmin';
import Footer from './Footer';
import './Estilos/DashboardAdmin.css';
import Unidades from './Imagenes/Unidades.png';
import Horarios from './Imagenes/Horarios.png';
import Rutas from './Imagenes/RutasAdmin.png';
import Conductores from './Imagenes/Conductores.png'; // Necesitas agregar esta imagen

function DashboardPage() {
  const navigate = useNavigate();

  const handleModuleClick = (moduleName) => {
    switch(moduleName) {
      case 'Unidades':
        navigate('/RegisterUnits');
        break;
      case 'Horarios':
        // navigate('/HorariosPage'); // Cuando tengas el componente
        console.log('Módulo Horarios - En desarrollo');
        break;
      case 'Rutas':
        navigate('/RutasPanel');
        break;
      case 'Conductores':
        navigate('/ConductoresPage');
        break;
      default:
        console.log('Módulo no encontrado');
    }
  };

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
              <button 
                onClick={() => handleModuleClick('Unidades')}
                className="dashboard-admin-module-button"
              >
                Unidades
              </button>
            </div>
            <div className="dashboard-admin-module-card">
              <img src={Horarios} alt="Horarios" className="dashboard-admin-module-icon" />
              <button 
                onClick={() => handleModuleClick('Horarios')}
                className="dashboard-admin-module-button"
              >
                Horarios
              </button>
            </div>
            <div className="dashboard-admin-module-card">
              <img src={Rutas} alt="Rutas" className="dashboard-admin-module-icon" />
              <button 
                onClick={() => handleModuleClick('Rutas')}
                className="dashboard-admin-module-button"
              >
                Rutas
              </button>
            </div>
            <div className="dashboard-admin-module-card">
              <img src={Conductores} alt="Conductores/Controladores" className="dashboard-admin-module-icon" />
              <button 
                onClick={() => handleModuleClick('Conductores')}
                className="dashboard-admin-module-button"
              >
                Conductores/Controladores
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DashboardPage;