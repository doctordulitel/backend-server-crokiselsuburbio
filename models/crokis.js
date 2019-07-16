var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var crokisSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre	es	necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    sector: { type: Schema.Types.ObjectId, ref: 'Sector', required: [true, 'El	id	sector	es	un	campo	obligatorio'] }
});

module.exports = mongoose.model('Crokis', crokisSchema);