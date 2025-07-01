const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DB_PATH = path.join(__dirname, '..', 'db.json');

leerDB = () => {
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data);
}

escribirDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

///obtener las paradas de una ruta por su id
router.get('/:id/paradas', (req, res) => {
  const db = leerDB();
  const ruta = db.Rutas.find(r => r.id === req.params.id);
  if (!ruta) return res.status(404).json({ mensaje: 'Ruta no encontrada' });

  const paradas = ruta.paradas || [];
  res.json(paradas);
});

// Agregar una parada a una ruta por su id
router.post('/:id/paradas', (req, res) => {
  const { parada } = req.body;
  if (!parada) return res.status(400).json({ mensaje: 'Debe proporcionar una parada' });

  const db = leerDB();
  const ruta = db.Rutas.find(r => r.id === req.params.id);
  if (!ruta) return res.status(404).json({ mensaje: 'Ruta no encontrada' });

  if (!Array.isArray(ruta.paradas)) ruta.paradas = [];
  ruta.paradas.push(parada);
  escribirDB(db);

  res.status(201).json({ mensaje: 'Parada agregada', paradas: ruta.paradas });
});

// Actualizar las paradas de una ruta por su id
router.put('/:id/paradas', (req, res) => {
  const { paradas } = req.body;
  if (!Array.isArray(paradas)) {
    return res.status(400).json({ mensaje: 'Debe proporcionar un arreglo de paradas' });
  }

  const db = leerDB();
  const ruta = db.Rutas.find(r => r.id === req.params.id);
  if (!ruta) return res.status(404).json({ mensaje: 'Ruta no encontrada' });

  ruta.paradas = paradas;
  escribirDB(db);

  res.json({ mensaje: 'Paradas actualizadas', paradas: ruta.paradas });
});

// Eliminar una parada de una ruta por su id y nombre de la parada
router.delete('/:id/paradas/:nombre', (req, res) => {
  const db = leerDB();
  const ruta = db.Rutas.find(r => r.id === req.params.id);
  if (!ruta) return res.status(404).json({ mensaje: 'Ruta no encontrada' });

  if (!Array.isArray(ruta.paradas)) ruta.paradas = [];
  const index = ruta.paradas.findIndex(p => p === req.params.nombre);
  if (index === -1) return res.status(404).json({ mensaje: 'Parada no encontrada' });

  ruta.paradas.splice(index, 1);
  escribirDB(db);

  res.json({ mensaje: 'Parada eliminada', paradas: ruta.paradas });
});

module.exports = router;
