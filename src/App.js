import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Inicio from './Componentes/Inicio';
import Indice from './Componentes/Indice';
import Login from './Componentes/Login';
import TicketPage from './Componentes/Ticket (12)/TicketPage';
import LiveLocationPage from './Componentes/LiveLocationPage';
import DashboardPage from './Componentes/DashboardPage';
import RegisterUnitsPage from './Componentes/RegisterUnitsPage';
import RutasPanel from './Componentes/RutasPanel';
import PasajeroForm from './Componentes/PasajerosForm';
import RegistroCooperativa from './Componentes/RegistroCooperativa';
import TripSelectionPage from './Componentes/TripSelectionPage';
import RegistroPasajerosPage from './Componentes/RegistroPasajerosPage';
import SeleccionAsientosPage from './Componentes/SeleccionAsientosPage';
import TablaPasajeros from './Componentes/TablaPasajeros';
import RutaForm from './Componentes/RutaForm';
import Registro from './Componentes/Registro';

function App() {


  return (

    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Indice />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/PasajeroForm" element={<Registro />} />
          <Route path="/RegistroCooperativa" element={<RegistroCooperativa />} />
          <Route path="/TripSelectionPage" element={<TripSelectionPage />} />
          <Route path="/RegistroPasajerosPage" element={<RegistroPasajerosPage />} />
          <Route path="/SeleccionAsientosPage" element={<SeleccionAsientosPage/>} />
          <Route path="/TablaPasajeros" element={<TablaPasajeros />} />
          <Route path="/TicketPage" element={<TicketPage />} />
          <Route path="/RealTimeMap" element={<LiveLocationPage />} />
          <Route path="/DashboardAdmin" element={<DashboardPage />} />
          <Route path="/RegisterUnits" element={<RegisterUnitsPage />} />
          <Route path="/RutasPanel" element={<RutasPanel />} />
          <Route path="/RutaForm" element={<RutaForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
