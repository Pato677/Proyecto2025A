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

router.get('/', (_, res) => {
  const db = leerDB();
  if (!db.Rutas) {
    return res.status(404).json({ mensaje: 'No hay rutas registradas' });
  }else {
    res.json(db.Rutas || []);
  }
  
});

router.get('/:id', (req, res) => {
  const db = leerDB();
  const ruta = db.Rutas.find(r => r.id === req.params.id);
  if (!ruta) return res.status(404).json({ mensaje: 'Ruta no encontrada' });
  res.json(ruta);
});

router.post('/', (req, res) => {

  const nuevaRuta = req.body;
    const db = leerDB();
    const nuevasRutas = db.Rutas || [];

    if (!nuevaRuta.id) {
        const nuevoId = nuevasRutas.length > 0
          ? Math.max(...nuevasRutas.map(r => parseInt(r.id) || 0)) + 1
          : 1; // Comenzar desde 1 si no hay rutas
        nuevaRuta.id= nuevoId.toString();
    }
  nuevasRutas.push(nuevaRuta);
  db.Rutas = nuevasRutas;
  escribirDB(db);
    res.status(201).json(nuevaRuta);
    // error si no se crea la ruta
    if (!db.Rutas.includes(nuevaRuta)) {
        return res.status(500).json({ mensaje: 'No se pudo crear la ruta' });
    }

});

router.put('/:id', (req, res) => {
  const db = leerDB();
  const index = db.Rutas.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Ruta no encontrada' });

  const rutaActualizada = { ...db.Rutas[index], ...req.body };
  db.Rutas[index] = rutaActualizada;
  escribirDB(db);
  res.json(rutaActualizada);
});

router.delete('/:id', (req, res) => {
  const db = leerDB();
  const index = db.Rutas.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Ruta no encontrada' });

  db.Rutas.splice(index, 1);
  escribirDB(db);
  res.status(204).send();
});

module.exports = router;