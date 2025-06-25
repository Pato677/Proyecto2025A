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
function escribirDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// GET todas las unidades
router.get('/', (_, res) => {
  const db = leerDB();
  res.json(db.unidades || []);
});

// GET una unidad por id
router.get('/:id', (req, res) => {
  const db = leerDB();
  const unidad = (db.unidades || []).find(u => String(u.id) === req.params.id);
  if (unidad) {
    res.json(unidad);
  } else {
    res.status(404).json({ error: 'Unidad no encontrada' });
  }
});

// POST crear nueva unidad
router.post('/', (req, res) => {
  const db = leerDB();
  const nuevasUnidades = db.unidades || [];
  const nuevaUnidad = req.body;
  // Generar un id único si no viene en el body
  if (!nuevaUnidad.id) {
    nuevaUnidad.id = nuevasUnidades.length > 0
      ? Math.max(...nuevasUnidades.map(u => Number(u.id))) + 1
      : -1;
  }
  nuevasUnidades.push(nuevaUnidad);
  db.unidades = nuevasUnidades;
  escribirDB(db);
  res.status(201).json(nuevaUnidad);
});

// PUT actualizar unidad por id
router.put('/:id', (req, res) => {
  const db = leerDB();
  let unidades = db.unidades || [];
  const idx = unidades.findIndex(u => String(u.id) === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Unidad no encontrada' });
  }
  unidades[idx] = { ...unidades[idx], ...req.body, id: unidades[idx].id };
  db.unidades = unidades;
  escribirDB(db);
  res.json(unidades[idx]);
});

// DELETE eliminar unidad por id
router.delete('/:id', (req, res) => {
  const db = leerDB();
  let unidades = db.unidades || [];
  const idx = unidades.findIndex(u => String(u.id) === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Unidad no encontrada' });
  }
  const eliminada = unidades.splice(idx, 1)[0];
  db.unidades = unidades;
  escribirDB(db);
  res.json(eliminada);
});

module.exports = router;
