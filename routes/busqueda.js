var express = require('express');

var app = express();

// Rutas

var Sector = require('../models/sector.js');
var Crokis = require('../models/crokis.js');
var Usuario = require('../models/usuario.js');


//=========================================
//BUSQUEDA ESPECÍFICA
//=============================================
app.get('/coleccion/:tabla/:busqueda', (req, res, ) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'crokis':
            promesa = buscarCrokis(busqueda, regex);
            break;

        case 'secores':
            promesa = buscarSectores(busqueda, regex);
            break;

        default:

            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son usuarios, crokis y sectores',
                error: { message: 'tipo de tabla/colección no válido' }
            });
    }

    promesa.then(data => {
        return res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});




//=========================================
//BUSQUEDA GENERAL
//=============================================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarSectores(busqueda, regex),
            buscarCrokis(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                sectores: respuestas[0],
                crokis: respuestas[1],
                usuarios: respuestas[2]
            });

        })


});


function buscarSectores(busqueda, regex) {


    return new Promise((resolve, reject) => {

        Sector.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, sectores) => {


                if (err) {
                    reject('Error al cargar sectores', err);
                } else {
                    resolve(sectores)
                }
            })

    });



}

function buscarCrokis(busqueda, regex) {


    return new Promise((resolve, reject) => {

        Crokis.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('sector')
            .exec((err, crokis) => {


                if (err) {
                    reject('Error al cargar crokis', err);
                } else {
                    resolve(crokis)
                }
            })


    });


}

function buscarUsuarios(busqueda, regex) {


    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuario) => {
                if (err) {
                    reject('error al mandar usuarios', err);
                } else {
                    resolve(usuario);
                }
            })

    });





}


module.exports = app;