const mongooes = require('mongoose');

const MenuSchema = new mongooes.Schema({
    name: String,
    key: {
        unique: true,
        type: Number
    },
    isSpecial: Boolean,
    img: String
});

module.exports = mongooes.model('Menus', MenuSchema);