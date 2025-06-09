import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Inicio from './Componentes/Inicio';
import Indice from './Componentes/Indice';
import Login from './Componentes/Login'; // Agrega esta línea

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Indice />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Login" element={<Login />} /> {/* Nueva ruta */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
