const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando' });
});

app.listen(port, () => {
  console.log(`Servidor de prueba corriendo en http://localhost:${port}`);
});
