var express = require('express');

var app = express();

// Rutas
app.get('/', (rep, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })
});


module.exports = app;