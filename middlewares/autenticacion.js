var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;



//===============================
// Verificar token
//===============================
exports.verificaToken = function(eq, res, next) {


    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'No tienes autorización: Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();


    });

}