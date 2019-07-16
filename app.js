// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar variables
var app = express();


//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var sectorRoutes = require('./routes/sector');
var crokisRoutes = require('./routes/crokis');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

//Conexión a la Base de Datos
mongoose.connection.openUri('mongodb://localhost:27017/crokisdb', (err, res) => {
    if (err) throw err;

    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
})



//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/sector', sectorRoutes);
app.use('/crokis', crokisRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);


app.use('/', appRoutes);




//Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});