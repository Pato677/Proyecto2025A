const express = require('express');
const app = express();
const port = 8000;
app.get('/', function (_, res) {
    res.send('¡Hola Mundo!');
});
app.listen(port, function () {
    console.log('server.js escuchando en el puerto::', port);
});

