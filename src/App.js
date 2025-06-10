import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import Inicio from './Componentes/Inicio';
import Indice from './Componentes/Indice';
import Login from './Componentes/Login'; // Agrega esta línea
import TicketPage from './Componentes/Ticket (12)/TicketPage'; // Asegúrate de que la ruta sea correcta
import LiveLocationPage from './Componentes/LiveLocationPage';
import DashboardPage from './Componentes/DashboardPage';
import RegisterUnitsPage from './Componentes/RegisterUnitsPage';
import TripSelectionPage from './Componentes/TripSelectionPage';// Asegúrate de que la ruta sea correcta


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

      
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
