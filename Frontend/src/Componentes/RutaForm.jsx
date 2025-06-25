// src/Componentes/RutaForm.jsx
import React from 'react';
import './Estilos/Admin.css'; 
import mapImage from './Imagenes/rutas.png'; // Pon tu mapa en assets/map.png
import Button from './Button'; // Asegúrate de que la ruta sea correcta
const RutaForm = () => (
  <section className="ruta-form">
    <header className="ruta-form__header">Ruta Quito - Guayaquil</header>

    <div className="ruta-form__content">
      <div className="ruta-form__map">
        <img src={mapImage} alt="Mapa de ruta" />
      </div>

      <div className="ruta-form__controls">
        <button className="btn-control">Frecuencia</button>

        <div className="form-group">
          <label>Origen</label>
          <select>
            <option>UIO(Quitumbe)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Destino</label>
          <select>
            <option>GYE(Sur)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Hora de salida</label>
          <input type="time" />
        </div>

        <div className="form-group">
          <label>Hora estimada de llegada</label>
          <input type="time" />
        </div>

        <Button text="Añadir Parada"></Button>

        <div className="form-group">
          <label>Parada</label>
          <select>
            <option>Tambillo</option>
          </select>
        </div>

        <Button text="EliminarParada" />
      </div>
    </div>
  </section>
);

export default RutaForm;
