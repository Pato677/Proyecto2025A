import react from "react";
import { useState, useEffect } from "react";

const Pasajerocrud = (props) => {
    const [id, nombre, apellido, fechaNacimiento, cedula, correo, contrasena] = props;

    return (
        <div className="pasajero-crud">
            <h2>CRUD de Pasajeros</h2>
            <p>ID: {id}</p>
            <p>Nombre: {nombre}</p>
            <p>Apellido: {apellido}</p>
            <p>Fecha de Nacimiento: {fechaNacimiento}</p>
            <p>Cédula: {cedula}</p>
            <p>Correo: {correo}</p>
            <p>Contraseña: {contrasena}</p>
        </div>
    );
  
}
export default Pasajerocrud;