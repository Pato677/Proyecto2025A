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
import SeatSelector from './Componentes/SeatSelector';
import TablaPasajeros from './Componentes/TablaPasajeros';
import RoutesTable from './Componentes/RoutesTable';
import RutaForm from './Componentes/RutaForm';

function App() {


  return (

    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Indice />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/PasajeroForm" element={<PasajeroForm />} />
          <Route path="/RegistroCooperativa" element={<RegistroCooperativa />} />
          <Route path="/TripSelectionPage" element={<TripSelectionPage />} />
          <Route path="/RegistroPasajerosPage" element={<RegistroPasajerosPage />} />
          <Route path="/SeatSelector" element={<SeatSelector />} />
          <Route path="/TablaPasajeros" element={<TablaPasajeros />} />
          <Route path="/TicketPage" element={<TicketPage />} />
          <Route path="/RealTimeMap" element={<LiveLocationPage />} />
          <Route path="/DashboardAdmin" element={<DashboardPage />} />
          <Route path="/RegisterUnits" element={<RegisterUnitsPage />} />
          <Route path="/RoutesTable" element={<RoutesTable />} />
          <Route path="/RutaForm" element={<RutaForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
