import React from 'react';
import './Estilos/TablaPasajeros.css'; // Asegúrate de que la ruta sea correcta
const TablaPasajeros = () => {
    return (
        <div className="pasajeros-box">
          <p className="subtitulo-tabla">Pasajeros</p>
          <div className="tabla-pasajeros">
            <table>
              <thead>
                <tr>
                  <th>Nro asiento</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>75</td>
                  <td>Juanito</td>
                  <td>Poveda</td>
                  <td>12.25</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    );
}
export default TablaPasajeros;