import React from 'react';
import HeaderAdmin from './HeaderAdmin';
import Footer from './Footer';
import './Estilos/RegisterUnits.css';

function RegisterUnitsPage() {
  return (
    <div className="register-units-page">
      <HeaderAdmin />

      <main className="register-units-main">
        <h1 className="register-units-title">Registrar Unidades</h1>
        <div className="register-units-content">
          <div className="register-units-table-box">
            <table className="register-units-table">
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
                  <td>PBXZ1234</td>
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
          <div className="register-units-image-box">
            <img
              src="https://multipasajes.travel/wp-content/uploads/2021/06/velotax1.jpg"
              alt="Bus"
              className="register-units-image"
            />
            <button className="register-units-upload-btn">Subir imagen</button>
          </div>
        </div>

        <div className="register-units-btn-group">
          <button className="register-units-btn">Agregar</button>
          <button className="register-units-btn">Eliminar</button>
          <button className="register-units-btn">Actualizar</button>
        </div>

        <div className="register-units-btn-group">
          <button className="register-units-btn back"><b>ATRÁS</b></button>
          <button className="register-units-btn location"><b>Ver ubicación</b></button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default RegisterUnitsPage;