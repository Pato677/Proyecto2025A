import React from 'react';
import './Estilos/TablaPasajeros.css'; // Asegúrate de que la ruta sea correcta

const TablaPasajeros = ({ pasajeros = [] }) => {
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
                {pasajeros.length > 0 ? (
                  pasajeros.map((pasajero, index) => (
                    <tr key={index}>
                      <td>{pasajero.asiento}</td>
                      <td>{pasajero.nombres}</td>
                      <td>{pasajero.apellidos}</td>
                      <td>{pasajero.descripcionPrecio}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>75</td>
                    <td>Juanito</td>
                    <td>Poveda</td>
                    <td>12.25</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    );
}
export default TablaPasajeros;