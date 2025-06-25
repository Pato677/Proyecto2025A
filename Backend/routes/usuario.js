const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DB_PATH = path.join(__dirname, '..', 'db.json');


// Helper para leer el archivo
function leerDB() {
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data);
}

// Helper para escribir el archivo
function escribirDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// GET todos los usuarios o filtrado
router.get('/', (req, res) => {
  const db = leerDB();
  let usuarios = db.UsuarioPasajero;

  const { correo, contrasena, cedula } = req.query;

  if (correo && contrasena) {
    usuarios = usuarios.filter(u => u.correo === correo && u.contrasena === contrasena);
  } else if (correo) {
    usuarios = usuarios.filter(u => u.correo === correo);
  } else if (cedula) {
    usuarios = usuarios.filter(u => u.cedula === cedula);
  }

  res.json(usuarios);
});

// GET usuario por ID
router.get('/:id', (req, res) => {
  const db = leerDB();
  const usuario = db.UsuarioPasajero.find(u => u.id === req.params.id);
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  res.json(usuario);
});

// POST crear usuario
router.post('/', (req, res) => {
  const db = leerDB();
  const nuevo = req.body;
  nuevo.id = Math.random().toString(36).substring(2, 6); // ID simple

  db.UsuarioPasajero.push(nuevo);
  escribirDB(db);
  res.status(201).json(nuevo);
});

// PUT actualizar usuario
router.put('/:id', (req, res) => {
  const db = leerDB();
  const index = db.UsuarioPasajero.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  db.UsuarioPasajero[index] = { ...db.UsuarioPasajero[index], ...req.body };
  escribirDB(db);
  res.json(db.UsuarioPasajero[index]);
});

// DELETE eliminar usuario
router.delete('/:id', (req, res) => {
  const db = leerDB();
  const nuevoArray = db.UsuarioPasajero.filter(u => u.id !== req.params.id);
  if (nuevoArray.length === db.UsuarioPasajero.length) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  db.UsuarioPasajero = nuevoArray;
  escribirDB(db);
  res.json({ mensaje: 'Usuario eliminado correctamente' });
});

module.exports = router;
