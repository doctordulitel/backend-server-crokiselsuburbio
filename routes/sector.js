var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

//var SEED = require('../config/config').SEED;

var app = express();

var Sector = require('../models/sector');


//===============================
// Obtener todos los sectores
//===============================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);


    Sector.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(

            (err, sectores) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando sector',
                        errors: err
                    });
                }

                Sector.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        sectores: sectores,
                        total: conteo
                    });
                })




            });

});


//===============================
// Actualizar nuevo sector
//===============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Sector.findById(id, (err, sector) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar sector',
                errors: err
            });
        }
        if (!sector) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El sector con el id' + id + 'no existe',
                errors: { message: 'No existe un sector con ese ID' }
            });
        }

        sector.nombre = body.nombre;
        sector.usuario = req.usuario._id;


        sector.save((err, sectorGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar sector',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                sector: sectorGuardado
            })


        });

    });



})

//===============================
// Crear nuevo sector
//===============================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var sector = new Sector({
        nombre: body.nombre,
        usuario: req.usuario._id


    });

    sector.save((err, sectorGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear sector',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            sector: sectorGuardado
        })

    });

});


//===============================
// Borrar un sector por el ID
//===============================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Sector.findByIdAndRemove(id, (err, sectorBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar sector',
                errors: err
            });
        }

        if (!sectorBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un sector con ese id',
                errors: { message: 'No existe un sector con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            sector: sectorBorrado
        })
    })
})



module.exports = app;