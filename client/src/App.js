import './App.css';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import React from 'react';
import { AuthProvider } from './Componentes/AuthContext';
import ProtectedRoute from './Componentes/ProtectedRoute';
import Inicio from './Componentes/Inicio';
import Indice from './Componentes/Indice';
import Login from './Componentes/Login';
import TicketPage from './Componentes/Ticket (12)/TicketPage';
import LiveLocationPage from './Componentes/LiveLocationPage';
import DashboardPage from './Componentes/DashboardPage';
import RegisterUnitsPage from './Componentes/RegistrarUnidadesPage';
import RutasPanel from './Componentes/RutasPanel';
import RegistroCooperativa from './Componentes/RegistroCooperativa';
import SeleccionViaje from './Componentes/SeleccionViaje';
import RegistroPasajerosPage from './Componentes/RegistroPasajerosPage';
import SeleccionAsientosPage from './Componentes/SeleccionAsientosPage';
import TablaPasajeros from './Componentes/TablaPasajeros';
import RutaForm from './Componentes/RutaForm';
import Registro from './Componentes/Registro';
import FormasDePagoPage from './Componentes/FormasDePagoPage';
import Button from './Componentes/Button';
import PerfilUsuario from './Componentes/PerfilUsuario';
import SuperAdminDashboard from './Componentes/SuperAdminDashboard';
import ConductoresPage from './Componentes/ConductoresPage';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas */}
            
            <Route path="/Indice" element={<Indice />} />
            
            <Route path="/" element={<Navigate to="/Inicio" replace />} />
            <Route path="/Inicio" element={<Inicio />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/PasajeroForm" element={<Registro />} />
            <Route path="/RegistroCooperativa" element={<RegistroCooperativa />} />
            
            {/* Rutas para usuarios finales (público por ahora, pueden requerir auth después) */}
            <Route path="/SeleccionViaje" element={<SeleccionViaje/>} />
            <Route path="/RegistroPasajerosPage" element={<RegistroPasajerosPage />} />
            <Route path="/SeleccionAsientosPage" element={<SeleccionAsientosPage/>} />
            <Route path="/TablaPasajeros" element={<TablaPasajeros />} />
            <Route path="/TicketPage" element={<TicketPage />} />
            <Route path="/RealTimeMap" element={<LiveLocationPage />} />
            <Route path="/FormasDePagoPage" element={<FormasDePagoPage />} />
            <Route path="/PerfilUsuario" element={<PerfilUsuario />} />
            
            {/* Rutas protegidas para cooperativas y administradores */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRole={null}>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/DashboardAdmin" 
              element={
                <ProtectedRoute requiredRole="cooperativa">
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/RegisterUnits" 
              element={
                <ProtectedRoute requiredRole="cooperativa">
                  <RegisterUnitsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/RutasPanel" 
              element={
                <ProtectedRoute requiredRole="cooperativa">
                  <RutasPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/RutaForm" 
              element={
                <ProtectedRoute requiredRole="cooperativa">
                  <RutaForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/SuperAdmin" 
              element={
                <ProtectedRoute requiredRole="superuser">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ConductoresPage" 
              element={
                <ProtectedRoute requiredRole="cooperativa">
                  <ConductoresPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta de utilidad */}
            <Route path="/boton" element={<Button text="Atras" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
