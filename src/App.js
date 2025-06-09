
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Inicio from './Componentes/Inicio';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
  <Routes>
    <Route path="/" element={<Inicio />} />
   
  </Routes>
</BrowserRouter>

    </div>
  );
}

export default App;
