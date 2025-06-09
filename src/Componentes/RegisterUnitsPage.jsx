import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Button from './Button';
import './Estilos/styles.css';

function RegisterUnitsPage() {
  return (
    <div className="ticket-page">
      <Header showStep={false} />

      <main className="main-content">
        <h1>Registrar Unidades</h1>

        <div className="register-units-container">
          <div className="units-table-box">
            <table className="units-table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>N° de unidad</th>
                  <th>Conductor</th>
                  <th>Controlador</th>
                  <th>N° de pisos</th>
                  <th>Nro de asientos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>IU132C</td>
                  <td>20</td>
                  <td>Juan Perez</td>
                  <td>Carlos Rodriguez</td>
                  <td>2</td>
                  <td>54</td>
                </tr>
                {/* filas vacías */}
                {[...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6}>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="units-image-box">
            <img
              src="https://i.imgur.com/E5AzGU4.jpg" // imagen de ejemplo
              alt="Bus"
              className="units-image"
            />
            <button className="custom-button">Subir imagen</button>
          </div>
        </div>

        <div className="button-group">
          <Button text="Agregar" />
          <Button text="Eliminar" />
          <Button text="Actualizar" />
        </div>

        <div className="button-group">
          <Button text="ATRÁS" />
          <Button text="Ver ubicación" />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default RegisterUnitsPage;
