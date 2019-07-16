var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Crokis = require('../models/crokis');


//===============================
// Obtener todos los crokis
//===============================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Crokis.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('sector')
        .exec(

            (err, crokis) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando crokises',
                        errors: err
                    });
                }

                Crokis.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        crokis: crokis,
                        total: conteo
                    });
                });





            });


    //===============================
    // Actualizar nuevo crokis
    //===============================
    app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

        var id = req.params.id;
        var body = req.body;

        Crokis.findById(id, (err, crokis) => {



            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar crokis',
                    errors: err
                });
            }
            if (!crokis) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El crokis con el id' + id + 'no existe',
                    errors: { message: 'No existe un crokis con ese ID' }
                });
            }

            crokis.nombre = body.nombre;
            crokis.usuario = req.usuario._id;
            crokis.sector = body.sector;


            crokis.save((err, crokisGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar crokis',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    crokis: crokisGuardado
                })


            });

        });



    })

    //===============================
    // Crear nuevo crokis
    //===============================
    app.post('/', mdAutenticacion.verificaToken, (req, res) => {

        var body = req.body;

        var crokis = new Crokis({
            nombre: body.nombre,
            usuario: req.usuario._id,
            sector: body.sector


        });

        crokis.save((err, crokisGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear crokis',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                crokis: crokisGuardado
            })

        });

    });


    //===============================
    // Borrar un crokis por el ID
    //===============================
    app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
        var id = req.params.id;

        Crokis.findByIdAndRemove(id, (err, crokisBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al borrar crokis',
                    errors: err
                });
            }

            if (!crokisBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un crokis con ese id',
                    errors: { message: 'No existe un crokis con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                sector: crokisBorrado
            });
        });
    });
})

module.exports = app;