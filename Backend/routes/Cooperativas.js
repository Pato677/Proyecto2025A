const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DB_PATH = path.join(__dirname, '..', 'db.json');

function leerDB() {
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data);
}

function escribirDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// GET todas las cooperativas o filtrado
router.get('/', (req, res) => {
  const db = leerDB();
  let cooperativas = db.Cooperativas;

  const { nombre, id } = req.query;

  if (nombre) {
    cooperativas = cooperativas.filter(c => c.nombre.toLowerCase().includes(nombre.toLowerCase()));
  }
  
  if (id) {
    cooperativas = cooperativas.filter(c => c.id === id);
  }

  res.json(cooperativas);
});

// POST crear cooperativa
router.post('/', (req, res) => {
  const db = leerDB();
  const nuevaCooperativa = req.body;
  nuevaCooperativa.id = Math.random().toString(36).substring(2, 6); // ID simple

  db.Cooperativas.push(nuevaCooperativa);
  escribirDB(db);
  res.status(201).json(nuevaCooperativa);
});
// PUT actualizar cooperativa
router.put('/:id', (req, res) => {
    const db = leerDB();
    const index = db.Cooperativas.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ mensaje: 'Cooperativa no encontrada' });
    
    db.Cooperativas[index] = { ...db.Cooperativas[index], ...req.body };
    escribirDB(db);
    res.json(db.Cooperativas[index]);
    }
);

// DELETE eliminar cooperativa
router.delete('/:id', (req, res) => {
    const db = leerDB();
    const nuevoArray = db.Cooperativas.filter(c => c.id !== req.params.id);
    if (nuevoArray.length === db.Cooperativas.length) {
        return res.status(404).json({ mensaje: 'Cooperativa no encontrada' });
    }
    
    db.Cooperativas = nuevoArray;
    escribirDB(db);
    res.json({ mensaje: 'Cooperativa eliminada' });
    }
);
// Verificamos credenciales para el login
// Verificamos credenciales usando POST con body JSON
router.post('/login', (req, res) => {
  const db = leerDB();
  const { correo, contrasena } = req.body;

  const cooperativa = db.Cooperativas.find(c => c.correo === correo && c.contrasena === contrasena);
  if (!cooperativa) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }

  res.json({ mensaje: 'Login exitoso', cooperativa });
});