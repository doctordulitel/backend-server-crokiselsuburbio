var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Crokis = require('../models/crokis');
var Sector = require('../models/sector');


// default options
app.use(fileUpload());


// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de colección
    var tiposValidos = ['sectores', 'crokis', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es válida',
            errors: { message: 'Tipo de coleccion no es válida' }
        })
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error subiendo archivo: no selecionó nada',
            errors: { message: 'debe seleccionar una imagen' }
        })
    }
    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // solo estas extensiones aceptamos

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }


    // nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error a mover archivo',
                errors: err
            });
        }


        subirPorTipo(tipo, id, nombreArchivo, res);

        //  res.status(200).json({
        //      ok: true,
        //      mensaje: 'Petición realizada correctamente',
        //      nombreCortado: nombreCortado
        //  });

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // })
    });

});





function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }
                });
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                //  if (err) {
                //      return res.status(400).json({
                //          ok: false,
                //          mensaje: 'La imagen no se pudo actualizar',
                //          errors: err
                //      });
                //  }

                usuarioActualizado.password = ':)';
                res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });


            });


        });
    }

    if (tipo === 'crokis') {

        Crokis.findById(id, (err, crokis) => {

            if (!crokis) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'crokis no existe',
                    errors: { message: 'crokis no existe' }
                });
            }

            var pathViejo = './uploads/crokis/' + crokis.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }
                });
            }

            crokis.img = nombreArchivo;

            crokis.save((err, crokisActualizado) => {

                //  if (err) {
                //      return res.status(400).json({
                //          ok: false,
                //          mensaje: 'La imagen no se pudo actualizar',
                //          errors: err
                //      });
                //  }


                res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de crokis actualizada',
                    usuario: crokisActualizado
                });


            });


        });

    }
    if (tipo === 'sectores') {
        Sector.findById(id, (err, sector) => {

            if (!sector) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Sector no existe',
                    errors: { message: 'Sector no existe' }
                });
            }

            var pathViejo = './uploads/sectores/' + sector.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }
                });
            }

            sector.img = nombreArchivo;

            sector.save((err, sectorActualizado) => {

                //  if (err) {
                //      return res.status(400).json({
                //          ok: false,
                //          mensaje: 'La imagen no se pudo actualizar',
                //          errors: err
                //      });
                //  }


                res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de sector actualizada',
                    usuario: sectorActualizado
                });


            });


        });

    }

}




module.exports = app;