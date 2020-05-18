const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
    name: String,
    main_ingredient: String,
    ingredient: String,
    menu: Number,
    img: String,
    url: String,
    view: Number,
    price: Number,
    id_catogory: String,
});

module.exports = mongoose.model('Dishes', DishSchema);