const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DB_PATH = path.join(__dirname, '..', 'db.json');

// Leer la base de datos
function leerDB() {
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data);
}

// Escribir la base de datos
function escribirDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// GET: Obtener todas las ciudades con sus terminales
router.get('/', (req, res) => {
  const db = leerDB();
  res.json(db.TerminalesInterprovinciales || []);
});

// GET: Obtener una ciudad por ID
router.get('/:id', (req, res) => {
  const db = leerDB();
  const ciudad = db.TerminalesInterprovinciales.find(c => c.id === req.params.id);
  if (!ciudad) return res.status(404).json({ mensaje: 'Ciudad no encontrada' });
  res.json(ciudad);
});

// POST: Agregar una nueva ciudad con terminales
router.post('/', (req, res) => {
  const db = leerDB();
  const nuevaCiudad = req.body;
  nuevaCiudad.id = Math.random().toString(36).substring(2, 6);
  db.TerminalesInterprovinciales.push(nuevaCiudad);
  escribirDB(db);
  res.status(201).json(nuevaCiudad);
});

// PUT: Actualizar ciudad y terminales por ID
router.put('/:id', (req, res) => {
  const db = leerDB();
  const index = db.TerminalesInterprovinciales.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Ciudad no encontrada' });

  db.TerminalesInterprovinciales[index] = {
    ...db.TerminalesInterprovinciales[index],
    ...req.body
  };

  escribirDB(db);
  res.json(db.TerminalesInterprovinciales[index]);
});

// DELETE: Eliminar ciudad por ID
router.delete('/:id', (req, res) => {
  const db = leerDB();
  const nuevaLista = db.TerminalesInterprovinciales.filter(c => c.id !== req.params.id);
  if (nuevaLista.length === db.TerminalesInterprovinciales.length) {
    return res.status(404).json({ mensaje: 'Ciudad no encontrada' });
  }
  db.TerminalesInterprovinciales = nuevaLista;
  escribirDB(db);
  res.json({ mensaje: 'Ciudad eliminada correctamente' });
});

module.exports = router;
