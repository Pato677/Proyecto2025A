import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Inicio from './Componentes/Inicio';
import Indice from './Componentes/Indice';
import Login from './Componentes/Login'; // Agrega esta línea
import TicketPage from './Componentes/Ticket (12)/TicketPage'; // Asegúrate de que la ruta sea correcta
import LiveLocationPage from './Componentes/LiveLocationPage';
import DashboardPage from './Componentes/DashboardPage';
import RegisterUnitsPage from './Componentes/RegisterUnitsPage';
import TripSelectionPage from './Componentes/TripSelectionPage';

import FormasDePagoPage from './Componentes/FormasDePagoPage';
import SeatSelector from './Componentes/SeatSelector';
import SeleccionAsientosPage from './Componentes/SeleccionAsientosPage';  
import StepProgress from './Componentes/StepProgress';




function App() {
  

  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Indice />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/TicketPage" element={<TicketPage />} />
          <Route path="/RealTimeMap" element={<LiveLocationPage/>} />
          <Route path="/DashboardAdmin" element={<DashboardPage />} />
          <Route path="/RegisterUnits" element={<RegisterUnitsPage />} />
          <Route path="/SeleccionViaje" element={<TripSelectionPage />} /> 
          <Route path="/Pasajeros" element={<FormasDePagoPage/>} />
          <Route path="/Seat" element={<SeleccionAsientosPage />} />

      
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
